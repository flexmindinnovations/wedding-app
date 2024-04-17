import { Component, OnInit } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { v4 as uuidv4 } from 'uuid';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Buffer as buffer } from 'buffer';
import * as moment from 'moment';

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
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.authService.getCustomerForPDFById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          // this.alertService.setAlertMessage('User details loaded successfully', AlertType.success);
          const { personalInfoModel, familyInfoModel, contactInfoModel, otherInfoModel, imageInfoModel } = data;
          personalInfoModel['dateOfBirth'] = moment(personalInfoModel['dateOfBirth']).format('dddd, D MMMM YYYY');
          personalInfoModel['timeOfBirth'] = moment(personalInfoModel['timeOfBirth']).format('h:mm A');
          const userInfo = {
            personalInfo: this.convertObjectToList(personalInfoModel),
            familyInfo: this.convertObjectToList(familyInfoModel),
            contactInfo: this.convertObjectToList(contactInfoModel),
            otherInfo: this.convertObjectToList(otherInfoModel),
            photos: this.convertObjectToList(imageInfoModel)
          };
          this.userInfo = userInfo;
          this.isDataLoaded = true;
        }
      },
      error: (error: any) => {
        if (error) {
          this.alertService.setAlertMessage('Error:Failed to load user details', AlertType.error);
        }
      }
    })
  }

  exportPdf() {
    // const tableEl: any = document.getElementById('profileDataTable');
    const tableEl: any = document.getElementById('userDataContainer');
    // console.log('tableEl: ', tableEl);
    let pageWidth = 595;
    let pageHeight = 842;
    var pageMargin = 20;

    pageWidth -= pageMargin * 2;
    pageHeight -= pageMargin * 2;

    const imageUrlToBase64 = async (url: any) => {
      const data = await fetch(url);
      const blob = await data.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64data = reader.result;
          resolve(base64data);
        };
        reader.onerror = reject;
      });
    };

    const pdf = new jsPDF('p', 'pt', 'a4');
    const logoImageSrc = '/assets/icon/logo.png';

    this.imageUrlToBase64(logoImageSrc).then((respones: any) => {
      const pageWidth = pdf.internal.pageSize.getWidth();
      const testImage = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAwADAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAGAAYDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EACAQAAEEAgEFAAAAAAAAAAAAAAcEBQgYBhcVAgkWJif/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAJhEAAAMGBQUAAAAAAAAAAAAABAYHAQUIFBYXAgMRGCYJFSMlJ//aAAwDAQACEQMRAD8APuQ8koXjOCnbrl4dIA2LH80rc6Yj9aorCKqNczCyDEi/VsPYl72dN6Pa9ozX2vGcV1jwfjbFziRzVOHQavXdA2tH9M5ZNgJiPWm4x+W8J0VV9aY8KQ+sX4M+QKY2xAvk+g+C4AdaVnMGeYzi65m5RYGdh1a1UYhgF8Ixz7puTimmhCaX6pfjqO/ECPiCJYltrUsCOROuBO8HW/aauNMwYh4vPxf/2Q==';
      pdf.addImage(respones, 'png', pageWidth / 2, 20, 100, 100);

      pdf.setFontSize(12);
      pdf.html(tableEl, {
        width: 592,
        margin: 20,
        autoPaging: 'text',
        html2canvas: {
          scale: 0.7,
          useCORS: true,
          height: pdf.internal.pageSize.getHeight() - 100,
          width: pdf.internal.pageSize.getWidth() - 100
        },
        image: {
          type: 'png',
          quality: 100
        },
        x: -50,
        y: 40,
        callback: (doc: jsPDF) => {
          pdf.output('dataurlnewwindow');
        }
      })
    })

    const imageModel = this.userInfo?.photos;

    imageModel.forEach((item: any) => {
      const imageUrl = environment.endpoint + `/${item?.value}`;
      this.imageUrlToBase64(imageUrl).then((respones: any) => {
        // console.log('respones: ', respones);
        const pageWidth = pdf.internal.pageSize.getWidth();
        pdf.addImage(respones, 'png', pageWidth / 2, 100, 100, 100);

      })
    });
  }

  async imageUrlToBase64(url: any) {
    try {
      const response = await fetch(url);
      const blob = await response.arrayBuffer();
      const contentType = response.headers.get('content-type');
      const base64String = `data:${contentType};base64,${buffer.from(
        blob,
      ).toString('base64')}`;
      return base64String;
    } catch (err) {
      return err;
    }
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
