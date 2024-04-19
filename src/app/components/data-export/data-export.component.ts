import { Component, OnInit } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import * as moment from 'moment';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { DOMAIN } from 'src/app/util/theme';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

interface ObjectType {
  title: string;
  value: any;
}

interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-data-export',
  templateUrl: './data-export.component.html',
  styleUrls: ['./data-export.component.scss'],
})
export class DataExportComponent implements OnInit {

  userInfo: any = [];
  exportColumns!: ExportColumn[];
  imageUrlPrefix = environment.endpoint;
  id = uuidv4();
  isDataLoaded = false;
  isLoading = false;
  personalInfoModel: any;
  constructor(
    private authService: AuthService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getUserDetails();
    const headerEl = document.getElementsByClassName('p-dialog-header-icons')[0];
    if (headerEl) {
      const exportButton = document.createElement('button');
      exportButton.type = 'button';
      exportButton.classList.add('pButton');
      exportButton.classList.add('pRipple');
      exportButton.classList.add('p-dialog-header-icon');
      exportButton.innerHTML = '<i class="pi pi-file-pdf"></i>';
      exportButton.title = 'Export PDF';
      exportButton.addEventListener('click', () => {
        this.exportPdf();
      });
      headerEl.insertBefore(exportButton, headerEl.firstChild);
    }
  }

  getUserDetails() {
    this.isLoading = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.authService.getCustomerForPDFById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          const { personalInfoModel, familyInfoModel, contactInfoModel, otherInfoModel, imageInfoModel } = data;
          this.personalInfoModel = JSON.parse(JSON.stringify(personalInfoModel));
          personalInfoModel['dateOfBirth'] = moment(personalInfoModel['dateOfBirth']).format('dddd, D MMMM YYYY');
          personalInfoModel['timeOfBirth'] = moment(personalInfoModel['timeOfBirth']).format('h:mm A');
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
          this.userInfo = userInfo;
          this.isDataLoaded = true;
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        if (error) {
          this.isLoading = false;
          this.alertService.setAlertMessage('Error:Failed to load user details', AlertType.error);
        }
      }
    })
  }

  exportPdf() {
    this.isLoading = true;
    const pdf = new jsPDF('p', 'pt', 'a4');
    const personalInfo = this.userInfo?.personalInfo;
    const familyInfo = this.userInfo?.familyInfo;
    const contactInfo = this.userInfo?.contactInfo;
    const otherInfo = this.userInfo?.otherInfo;
    const imageModel = this.userInfo?.photos;
    const images: any[] = [];
    imageModel.forEach((item: any) => {
      const imageUrl = environment.endpoint + `/${item?.value}`;
      images.push(imageUrl);
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const personalInfoData = this.buildTableBody(personalInfo);
    const familyInfoData = this.buildTableBody(familyInfo);
    const contactInfoData = this.buildTableBody(contactInfo);
    const otherInfoInfoData = this.buildTableBody(otherInfo);

    this.generatePdf(pageWidth, personalInfoData, familyInfoData, contactInfoData, otherInfoInfoData, images);
  }

  async generatePdf(pageWidth: any, personalInfoData: any, familyInfoData: any, contactInfoData: any, otherInfoInfoData: any, images: any) {
    const logoImageSrc = 'http://localhost:8100/assets/icon/logo.png';
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
                      text: 'Bio Date',
                      fillColor: '#f9fafb',
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
          text: 'Personal Information',
          style: 'subheader'
        },
        {
          table: {
            headerRows: 0,
            heights: 22,
            body: personalInfoData,
            widths: '*',
          },
          style: 'row',
          layout: 'noBorders'
        },
        {
          text: 'Family Information',
          style: 'subheader'
        },
        {
          table: {
            headerRows: 0,
            heights: 18,
            body: familyInfoData,
            widths: '*',
          },
          style: 'row',
          layout: 'noBorders'
        },
        {
          text: 'Conact Information',
          style: 'subheader'
        },
        {
          table: {
            headerRows: 0,
            heights: 18,
            body: contactInfoData,
            widths: '*',
          },
          style: 'row',
          layout: 'noBorders'
        },
        {
          text: 'Other Information',
          style: 'subheader'
        },
        {
          table: {
            headerRows: 0,
            heights: 18,
            body: otherInfoInfoData,
            widths: '*',
          },
          style: 'row',
          layout: 'noBorders'
        },
        {
          text: 'Photos',
          style: 'subheader'
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
          layout: 'noBorders',
          columnGap: 20
        },
      ],
      styles: {
        subheader: {
          fontSize: 12,
          margin: [0, 10, 0, 10],
          bold: true,
        },
        row: {
          fontSize: 10,
          alignment: 'left',
          margin: [0, 5, 0, 5],
          leadingIndent: 15,
        }
      }
    };

    // pdfMake.createPdf(doc).open();
    const fileName = this.personalInfoModel?.fullName.replace(/\s/g, '_')+ '.pdf';
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
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
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
      img.src = url;
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.userInfo);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'User Details');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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

}
