import { map } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import { jsPDF } from 'jspdf';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { DOMAIN } from 'src/app/util/theme';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface ObjectType {
  title: string;
  value: any;
}

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.page.html',
  styleUrls: ['./profile-view.page.scss'],
})
export class ProfileViewPage implements OnInit {
  @Input() customerId: any;
  isLoading: boolean = false;
  isDataLoaded: boolean = false;
  isLoggedIn = false;
  headerColor: string = '#ff646b';
  imageUrlPrefix = environment.endpoint;
  userInfo: any;
  personalInfoModel: any;
  familyInfoModel: any;
  contactInfoModel: any;
  otherInfoModel: any;
  imageInfoModel: any;

  dialogRef: DynamicDialogRef | undefined;

  userId: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private alertService: AlertService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.customerId) this.getUserDetails(this.customerId);
    else {
      this.activatedRoute.params.subscribe((params: any) => {
        const userId = params['id'];
        this.userId = userId;
        this.getUserDetails(userId);
      })
    }
  }

  getUserDetails(userId: any) {
    this.isLoading = true;
    this.authService.getCustomerForPDFById(userId).subscribe({
      next: (data: any) => {
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

  exportPdf() {
    this.isLoading = true;
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
      // [
      //   {
      //     text: 'Profile Code'
      //   },
      //   {
      //     text: 'ABC'
      //   }
      // ],
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


    this.generatePdf(pageWidth, personalInfoData, familyInfoData, contactInfoData, otherInfoInfoData, images);
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
      fileName = fullName ? fullName + '_' + timestamp.toString()+ '.pdf' : `${DOMAIN}_Profile.pdf`;
    }
    // pdfMake.createPdf(doc).open();
    pdfMake.createPdf(doc).download(fileName);
    this.isLoading = false;
  }

  buildTableBody(data: any) {
    var body: any = [];
    const columns = ['Title', 'Value']
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
    let d: any = new Date();
    const isValidDate = timeString == 'Invalid date' ? false : true;
    if (timeString && isValidDate) {
      const time = timeString.match(/(\d+)(?::(\d\d))?\s*(p?)/);
      d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
      d.setMinutes(parseInt(time[2]) || 0);
    } else d = '';
    return d;
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

  transformString(input: any) {
    let stringWithSpace = input.replace(/([a-z])([A-Z])/g, '$1 $2');
    if (stringWithSpace.includes('Id')) stringWithSpace = stringWithSpace.replace('Id', '');
    stringWithSpace = stringWithSpace.charAt(0).toUpperCase() + stringWithSpace.slice(1);
    return stringWithSpace;
  }

  getImageUrl(item: any) {
    return `${this.imageUrlPrefix}/${item?.value}`;
  }

  handleSignup() {
    this.dialogRef = this.dialogService.open(
      RegisterUserComponent, {
      header: 'Sign up',
      width: '25%',
      baseZIndex: 10000,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      maximizable: false
    })

    this.dialogRef.onClose.subscribe((afterClose: any) => {
      if (afterClose) { }
    });
  }

  handleLoginClick() {
    this.router.navigateByUrl('login');
  }

  getProfilLink() {
    const domainName = DOMAIN.toLocaleLowerCase();
    const link = `https://www.${domainName}.com/profiles/view/${this.userId}`;
    return link;
  }

  getWhatsappLink(mobileNumber: any) {
    const domainName = DOMAIN.toLocaleLowerCase();
    const messageText = `We got your marriage profile link \n https://www.${domainName}.com/profiles/view/${this.userId} on https://www.${domainName}.com \n
We would like to further talk on this proposal.`;
    const link = `https://wa.me/+91${mobileNumber}?text=${messageText}`;
    return link;
  }

}
