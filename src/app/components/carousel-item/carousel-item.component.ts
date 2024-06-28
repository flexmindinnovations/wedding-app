import { animate, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { fadeIn, fadeOut, scaleIn, scaleOut, slideLeft, slideRight } from 'src/app/animations/carousel.animation';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { DataExportComponent } from '../data-export/data-export.component';
import { jsPDF } from 'jspdf';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import * as moment from 'moment';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { DOMAIN } from 'src/app/util/theme';;
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface ObjectType {
  title: string;
  value: any;
}
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'carousel-item',
  templateUrl: './carousel-item.component.html',
  styleUrls: ['./carousel-item.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('* => *', [useAnimation(fadeIn, { params: { time: '900ms' } })]),
      transition('* => *', [useAnimation(fadeOut, { params: { time: '900ms' } })])
    ])
  ]
})
export class CarouselItemComponent implements OnInit {

  @Input() isDisplayed: boolean = false;
  @Input() data: any;
  isFavourite: boolean = false;
  imagePath: any = '';
  headerColor: string = '#ff646b';
  showLoginDialog = false;
  dialogRef: DynamicDialogRef | undefined;
  isLoggedIn = false;
  isDataLoaded: boolean = false;
  isLoading: boolean = false;
  imageUrlPrefix = environment.endpoint;
  userInfo: any;
  personalInfoModel: any;
  familyInfoModel: any;
  contactInfoModel: any;
  otherInfoModel: any;
  imageInfoModel: any;
  customerId: any;
  public screenWidth: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    public dialogService: DialogService,
    private sharedService: SharedService
  ) {
    this.onResize();
  }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    const networkImage = `${this.data.imagePath1 ? this.data.imagePath1 : this.data.imagePath2 ? this.data.imagePath2 : ''}`;
    this.imagePath = networkImage ? `${environment.endpoint}/${networkImage}` : '/assets/image/image-placeholder.png';
  }

  handleIsFavourite() {
    if (this.isLoggedIn) {
      this.isFavourite = !this.isFavourite;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        customerLikeId: 0,
        likerId: user?.user,
        likedId: this.data?.customerId,
        isLike: this.isFavourite
      };
      this.userService.setFavourite(payload).subscribe({
        next: (response: any) => {
          if (response) {
            this.alertService.setAlertMessage(response?.message, AlertType.success);
            this.getUpdatedFavouriteProfileList(user?.user);
          }
        },
        error: (error: any) => {
          this.alertService.setAlertMessage('Failed to add profile to favourites', AlertType.error);
        }
      })
    } else {
      const { customerId } = this.data;
      sessionStorage.setItem('inquiry', customerId);
      this.showLoginDialog = true;
    }
  }

  getUpdatedFavouriteProfileList(userId: any) {
    this.userService.getFavouriteProfileList(userId).subscribe({
      next: (response) => {
        if (response) {
          const profileList = response;
          this.sharedService.setFavouriteProfiles.next(profileList);
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error)
      }
    });
  }

  handleProfileClick() {
    if (this.authService.isLoggedIn()) {
      const hasName = this.data?.fullName.replace(/\s/g, '').trim().length > 0 ? true : false;
      const fullName = hasName ? `${this.data?.fullName}` : 'Profile Information';
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const { customerId } = this.data;
      const HistoryData = {
        viewHistoryId: 0,
        viewerId: user.user,
        viewedProfileId: customerId
      }
      this.sharedService.addProfileViewHistory(HistoryData).subscribe({
        next: (response: any) => {
          if (response) {
            console.log(response)
          }
        },
        error: (error) => {
          this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error)
        }
      });
      this.dialogRef = this.dialogService.open(
        DataExportComponent, {
        header: `${fullName}`,
        width: '80%',
        height: '90%',
        data: {
          ...this.data
        },
        baseZIndex: 10000,
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
        },
        maximizable: true,
        styleClass: 'data-export-popup'
      })
    } else {
      const { customerId } = this.data;
      sessionStorage.setItem('inquiry', customerId);
      this.showLoginDialog = true;
    }
  }

  handleButtonClick(src?: string) {
    this.showLoginDialog = false;
    setTimeout(() => {
      if (src == 'login') {
        this.router.navigateByUrl('login');
      } else {
        sessionStorage.removeItem('inquiry');
      }
    }, 300);
  }

  getUserDetails(customerId: any) {
    this.isLoading = true;
    this.authService.getCustomerForPDFById(customerId).subscribe({
      next: async (data: any) => {
        if (data) {
          const { personalInfoModel, familyInfoModel, contactInfoModel, otherInfoModel, imageInfoModel } = data;
          this.personalInfoModel = JSON.parse(JSON.stringify(personalInfoModel));
          personalInfoModel['dateOfBirth'] = moment(personalInfoModel['dateOfBirth']).format('dddd, D MMMM YYYY');
          personalInfoModel['timeOfBirth'] = this.getTime(personalInfoModel['timeOfBirth']);
          personalInfoModel['isPatrika'] = personalInfoModel['isPatrika'] == true ? 'Yes' : 'No';
          personalInfoModel['isPhysicallyAbled'] = personalInfoModel['isPhysicallyAbled'] == true ? 'Yes' : 'No';
          personalInfoModel['spectacles'] = personalInfoModel['spectacles'] == true ? 'Yes' : 'No';

          const userInfo = {
            personalInfo: this.convertObjectToList(personalInfoModel),
            familyInfo: this.convertObjectToList(familyInfoModel),
            contactInfo: this.convertObjectToList(contactInfoModel),
            otherInfo: this.convertObjectToList(otherInfoModel),
            photos: this.convertObjectToList(imageInfoModel)
          };
          this.personalInfoModel = userInfo?.personalInfo;
          this.familyInfoModel = userInfo?.familyInfo;
          this.contactInfoModel = userInfo?.contactInfo;
          this.otherInfoModel = userInfo?.otherInfo;
          this.imageInfoModel = userInfo?.photos;
          this.userInfo = userInfo;
          this.isDataLoaded = true;
          const pdf = new jsPDF('p', 'pt', 'a4');
          const personalInfo = this.userInfo?.personalInfo;
          const familyInfo = this.userInfo?.familyInfo;
          const contactInfo = this.userInfo?.contactInfo.map((item: any) => {
            if (item.title.includes('Whats Up')) {
              item.title = 'WhatsApp Number';
              item['color'] = 'blue',
                item['link'] = this.getWhatsappLink(item?.value);
            }
            return item;
          });
          const otherInfo = this.userInfo?.otherInfo;
          const imageModel = this.userInfo?.photos;
          const images: any[] = [];
          imageModel.forEach((item: any) => {
            const imageUrl = environment.endpoint + `/${item?.value}`;
            images.push(imageUrl);
          });
          const pageWidth = pdf.internal.pageSize.getWidth();
          let personalInfoData = this.buildTableBody(personalInfo);
          const familyInfoData = this.buildTableBody(familyInfo);
          let contactInfoData = this.buildTableBody(contactInfo);
          const otherInfoInfoData = this.buildTableBody(otherInfo);
          const profileAudit = [
            [
              {
                text: 'Profile Link'
              },
              {
                text: this.getProfilLink(),
                link: this.getProfilLink(),
                color: 'blue',
                style: 'profilelink'
              }
            ]
          ];
          personalInfoData = [...profileAudit, ...personalInfoData];

          contactInfoData.forEach((item: any) => {
            if (item[0] == 'WhatsApp Number') {
              item[0] = {
                text: item[0]
              },
                item[1] = {
                  text: item[1] + ' (Open Whatsapp)',
                  link: this.getWhatsappLink(item[1]),
                  color: 'blue'
                }
            }
          })
          await this.generatePdf(pageWidth, personalInfoData, familyInfoData, contactInfoData, otherInfoInfoData, images);
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        if (error) {
          this.isLoading = false;
          this.alertService.setAlertMessage('Error: Failed to load user details', AlertType.error);
        }
      }
    })
  }

  exportPdf(data: any, customerId: any) {
    this.customerId = customerId;
    if (data?.imagePath1 && data.imagePath2) {
      this.getUserDetails(customerId);
    } else {
      this.alertService.setAlertMessage('Profile is not updated', AlertType.error);
    }
  }


  async generatePdf(pageWidth: any, personalInfoData: any, familyInfoData: any, contactInfoData: any, otherInfoInfoData: any, images: any) {
    const logoImageSrc = `${window.location.origin}/assets/icon/logo.png`;
    const doc: TDocumentDefinitions = {
      content: [
        {
          image: await <any>this.getBase64ImageFromURL(logoImageSrc),
          height: 50,
          width: 100,
          style: {
            alignment: 'center',
            margin: [20, 20, 20, 20]
          }
        },
        {
          columns: [
            {
              width: '*',
              alignment: 'center',
              margin: [0, 10, 0, 0],
              table: {
                widths: '*',
                body: [
                  [
                    {
                      text: 'Bio Data',
                      fillColor: this.headerColor,
                      color: '#fff',
                      fontSize: 18,
                      bold: true,
                      margin: [10, 10, 10, 10]
                    }
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ]
        },
        {
          columns: [
            {
              width: '*',
              alignment: 'left',
              margin: 0,
              table: {
                widths: '*',
                body: [
                  [
                    {
                      text: 'Personal Information',
                      fillColor: this.headerColor,
                      color: '#fff',
                      fontSize: 12,
                      bold: true,
                      margin: 5
                    }
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ]
        },
        {
          table: {
            headerRows: 0,
            heights: 16,
            body: personalInfoData,
            widths: '*',
          },
          style: 'row',
          layout: {
            hLineWidth: function (i, node: any) {
              if (i === 0 || i === node.table.body.length) {
                return 0;
              }
              return (i === node.table.headerRows) ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 1;
            },
            hLineColor: function (i) {
              return '#ddd';
            },
            vLineColor: function (i) {
              return '#ddd';
            },
            paddingTop: function (i) {
              return 8;
            },
          }
        },
        {
          columns: [
            {
              width: '*',
              alignment: 'left',
              margin: 0,
              table: {
                widths: '*',
                body: [
                  [
                    {
                      text: 'Family Information',
                      fillColor: this.headerColor,
                      color: '#fff',
                      fontSize: 12,
                      bold: true,
                      margin: 5
                    }
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ]
        },
        {
          table: {
            headerRows: 0,
            heights: 18,
            body: familyInfoData,
            widths: '*',
          },
          style: 'row',
          layout: {
            hLineWidth: function (i, node: any) {
              if (i === 0 || i === node.table.body.length) {
                return 0;
              }
              return (i === node.table.headerRows) ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 1;
            },
            hLineColor: function (i) {
              return '#ddd';
            },
            vLineColor: function (i) {
              return '#ddd';
            },
            paddingTop: function (i) {
              return 8;
            },
          }
        },
        {
          columns: [
            {
              width: '*',
              alignment: 'left',
              margin: 0,
              table: {
                widths: '*',
                body: [
                  [
                    {
                      text: 'Conact Information',
                      fillColor: this.headerColor,
                      color: '#fff',
                      fontSize: 12,
                      bold: true,
                      margin: 5
                    }
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ]
        },
        {
          table: {
            headerRows: 0,
            heights: 18,
            body: contactInfoData,
            widths: '*',
          },
          style: 'row',
          layout: {
            hLineWidth: function (i, node: any) {
              if (i === 0 || i === node.table.body.length) {
                return 0;
              }
              return (i === node.table.headerRows) ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 1;
            },
            hLineColor: function (i) {
              return '#ddd';
            },
            vLineColor: function (i) {
              return '#ddd';
            },
            paddingTop: function (i) {
              return 8;
            },
          }
        },
        {
          columns: [
            {
              width: '*',
              alignment: 'left',
              margin: 0,
              table: {
                widths: '*',
                body: [
                  [
                    {
                      text: 'Other Information',
                      fillColor: this.headerColor,
                      color: '#fff',
                      fontSize: 12,
                      bold: true,
                      margin: 5
                    }
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ]
        },
        {
          table: {
            headerRows: 0,
            heights: 18,
            body: otherInfoInfoData,
            widths: '*',
          },
          style: 'row',
          layout: {
            hLineWidth: function (i, node: any) {
              if (i === 0 || i === node.table.body.length) {
                return 0;
              }
              return (i === node.table.headerRows) ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 1;
            },
            hLineColor: function (i) {
              return '#ddd';
            },
            vLineColor: function (i) {
              return '#ddd';
            },
            paddingTop: function (i) {
              return 8;
            },
          }
        },
        {
          columns: [
            {
              width: '*',
              alignment: 'left',
              margin: 0,
              table: {
                widths: '*',
                body: [
                  [
                    {
                      text: 'Photos',
                      fillColor: this.headerColor,
                      color: '#fff',
                      fontSize: 12,
                      bold: true,
                      margin: 5
                    }
                  ],
                ],
              },
              layout: 'noBorders',
            },
          ]
        },
        {
          table: {
            headerRows: 0,
            heights: 20,
            body: [
              [
                {
                  columns: [
                    {
                      width: '*',
                      alignment: 'left',
                      margin: [20, 10, 10, 20],
                      table: {
                        widths: '*',
                        body: [
                          [
                            {
                              image: await <any>this.getBase64ImageFromURL(images[0]),
                              height: 140,
                              width: 140,
                              style: {
                                alignment: 'left',
                              }
                            }
                          ],
                        ],
                      },
                      layout: 'noBorders',
                    },
                    {
                      width: '*',
                      alignment: 'left',
                      margin: [20, 10, 10, 20],
                      table: {
                        widths: '*',
                        body: [
                          [
                            {
                              image: await <any>this.getBase64ImageFromURL(images[1]),
                              height: 140,
                              width: 140,
                              style: {
                                alignment: 'left',
                              }
                            }
                          ],
                        ],
                      },
                      layout: 'noBorders'
                    },
                  ]
                }
              ]
            ],
            widths: '*',
          },
          style: 'row',
          columnGap: 20,
          layout: {
            hLineWidth: function (i, node: any) {
              if (i === 0) {
                return 0;
              }
              return (i === node.table.headerRows) ? 2 : 1;
            },
            vLineWidth: function (i) {
              return 1;
            },
            hLineColor: function (i) {
              return '#ddd';
            },
            vLineColor: function (i) {
              return '#ddd';
            },
            paddingTop: function (i) {
              return 8;
            },
          }
        },
      ],
      styles: {
        subheader: {
          fontSize: 12,
          margin: [0, 10, 0, 10],
          bold: true,
          fillColor: 'black',
          color: '#fff'
        },
        row: {
          fontSize: 10,
          alignment: 'left',
          margin: 0,
          leadingIndent: 15,
        },
        profilelink: {
          decoration: 'underline',
          decorationStyle: 'solid'
        }
      }
    };

    let fullName = this.personalInfoModel?.fullName;
    const timestamp = +new Date();
    let fileName = timestamp.toString() + '_' + `${DOMAIN}_Profile.pdf`;
    if (fullName) {
      fullName = this.personalInfoModel?.fullName?.replace(/\s/g, '_');
      fileName = fullName ? fullName + '_' + timestamp.toString() + '.pdf' : `${DOMAIN}_Profile.pdf`;
    }
    // pdfMake.createPdf(doc).open();
    pdfMake.createPdf(doc).download(fileName);
    this.isLoading = false;
  }


  buildTableBody(data: any) {
    var body: any = [];
    const columns = ['Title', 'Value'];
    data.forEach((row: any) => {
      const dataRow: any = [];
      columns.forEach((col) => {
        if (row?.value) dataRow.push(row[col.toLowerCase()].toString())
      })
      if (dataRow.length) body.push(dataRow);
    });
    return body;
  }

  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.crossOrigin = "anonymous";
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = (event: any) => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        }
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url + "?not-from-cache-please";
    });
  }

  getTime(time: any) {
    if (moment(time).isValid()) {
      return moment(time).format('h:mm A');
    } else {
      const parseString = moment(this.parseTimeString(time)).format('h:mm A');
      return parseString;
    }
  }

  parseTimeString(timeString: any) {
    console.log('timeString: ', timeString);

    const d = new Date();
    if (timeString) {
      const time = timeString.match(/(\d+)(?::(\d\d))?\s*(p?)/);
      d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
      d.setMinutes(parseInt(time[2]) || 0);
    }
    return d;
  }

  transformString(input: any) {
    let stringWithSpace = input.replace(/([a-z])([A-Z])/g, '$1 $2');
    if (stringWithSpace.includes('Id')) stringWithSpace = stringWithSpace.replace('Id', '');
    stringWithSpace = stringWithSpace.charAt(0).toUpperCase() + stringWithSpace.slice(1);
    return stringWithSpace;
  }

  // getImageUrl(item: any) {
  //   return `${this.imageUrlPrefix}/${item?.value}`;
  // }

  // handleSignup() {
  //   this.dialogRef = this.dialogService.open(
  //     RegisterUserComponent, {
  //     header: 'Sign up',
  //     width: '25%',
  //     baseZIndex: 10000,
  //     breakpoints: {
  //       '960px': '75vw',
  //       '640px': '90vw'
  //     },
  //     maximizable: false
  //   })

  //   this.dialogRef.onClose.subscribe((afterClose: any) => {
  //     if (afterClose) { }
  //   });
  // }

  // handleLoginClick() {
  //   this.router.navigateByUrl('login');
  // }

  getProfilLink() {
    const domainName = DOMAIN.toLocaleLowerCase();
    const origin = `${window.location.origin}`;
    const link = `${origin}.com/profiles/view/${this.customerId}`;
    return link;
  }

  getWhatsappLink(mobileNumber: any) {
    const domainName = DOMAIN.toLocaleLowerCase();
    const messageText = `We got your marriage profile link \n https://www.${domainName}.com/profiles/view/${this.customerId} on https://www.${domainName}.com \n
     We would like to further talk on this proposal.`;
    const link = `https://wa.me/+91${mobileNumber}?text=${messageText}`;
    return link;
  }

  convertObjectToList(obj: Record<string, any>): ObjectType[] {
    const convertedList: ObjectType[] = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const title = this.transformString(key);
        const value = obj[key];
        convertedList.push({ title, value });
      }
    }
    return convertedList;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }

  }
}

export type AnimationDirection = 'left' | 'right';
