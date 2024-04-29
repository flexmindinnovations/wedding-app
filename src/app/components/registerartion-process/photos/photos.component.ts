import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss'],
})
export class PhotosComponent implements OnInit, AfterViewInit {
  @Input() completedStep!: FormStep;
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  isEditMode: boolean = false;
  imagesData: any;
  @Output() photosData = new EventEmitter();
  @Output() isCancelled = new EventEmitter();
  @Output() isCompleted = new EventEmitter();
  customerRegistrationService = inject(CustomerRegistrationService);
  alert = inject(AlertService);
  cdref = inject(ChangeDetectorRef);
  sharedService = inject(SharedService);
  selectedFiles: any[] = [];
  // photoNext: boolean = false;
  thumbnailImage = '';
  photo1 = '';
  imageName: string = '';
  photoName: string = '';
  customerId: number = 0;
  router = inject(Router);
  imgData: any[] = [];

  @Output() nextFormStep = new EventEmitter();

  ngOnInit() {
    this.getCustomerDetails();
  }

  ngAfterViewInit(): void {
    this.sharedService.handleNextButtonClick().subscribe((event: any) => {
      const props: FormStep = {
        source: event,
        data: {},
        formId: 5,
        action: ActionValue.next,
        isCompleted: true,
        previous: null,
        next: null
      }
      this.photosData.emit(props);
      this.nextFormStep.emit('photo');
    })
  }

  getCustomerImages() {
    const imageInfoModel = this.customerData['imageInfoModel'];
    this.thumbnailImage = `${environment.endpoint}/${imageInfoModel?.imagePath1}`;
    const imageNameIndex = imageInfoModel?.imagePath1?.lastIndexOf('/') + 1;
    this.imageName = imageInfoModel?.imagePath1?.substring(imageNameIndex, imageInfoModel?.imagePath1.length);
    this.photo1 = `${environment.endpoint}/${imageInfoModel?.imagePath2}`;
    const photo1NameIndex = imageInfoModel?.imagePath2?.lastIndexOf('/') + 1;
    this.photoName = imageInfoModel?.imagePath2?.substring(photo1NameIndex, imageInfoModel?.imagePath2.length);
    if (this.thumbnailImage && this.photo1) {
      this.imgData.push(this.thumbnailImage);
      this.imgData.push(this.photo1);
    }
    if (this.imgData.length === 2) this.sharedService.imagesSelected.next(true);
    this.cdref.detectChanges();
  }

  handleSelectedImage(event: any, src: string) {
    switch (src) {
      case 'thumbnail':
        this.selectedFiles.push(event.file);
        break;
      case 'photo':
        this.selectedFiles.push(event.file);
        break;
    }
    const filename = event?.file?.name;
    if(filename && this.imgData.length < 2) {
      this.imgData.push(filename);
    }
    if (this.selectedFiles.length === 2) this.sharedService.imagesSelected.next(true);
    this.cdref.detectChanges();
  }

  handleClickOnPrevious(src: string) {
    const props: FormStep = {
      source: src,
      data: [],
      formId: 5,
      action: ActionValue.previous,
      isCompleted: false
    }
    this.photosData.emit(props);
  }

  handleCancelAction() {
    this.isCancelled.emit(true);
  }

  handleClickOnNext(src: string = 'photos') {
    this.cdref.detectChanges();
    if (this.isEditMode) this.updateCustomerInfo(src);
    else this.saveNewCustomerInfo(src);
  }


  saveNewCustomerInfo(src: string): void {
    const customerId: any = this.customerData?.customerId;
    const formData: FormData = new FormData();
    formData.append('customerId', customerId);
    if(this.selectedFiles.length) {
      this.selectedFiles.forEach((file: any) => {
        formData.append('file', file, file.name);
      })
    }
    this.customerRegistrationService.savePhotos(formData).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: [],
            formId: 5,
            action: ActionValue.next,
            isCompleted: true,
            previous: {
              source: 'other',
              data: {},
              formId: 4,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: null
          }
          this.sharedService.isUserDetailUpdated.next(true);
          this.isCompleted.emit(true);
          this.photosData.emit(props);
          this.customerRegistrationService.setRequestStatus(true, 'add');
          this.router.navigateByUrl("/");
        }
      },
      error: (error: any) => {
        this.alert.setAlertMessage('Photos: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(src: string): void {
    const customerId = this.customerData?.customerId;
    const formData: FormData = new FormData();
    formData.append('customerId', customerId);
    if(this.selectedFiles.length) {
      this.selectedFiles.forEach((file: any) => {
        formData.append('file', file, file.name);
      })
    }
    this.customerRegistrationService.updatePhotos(formData, customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: [],
            formId: 5,
            action: ActionValue.next,
            isCompleted: true,
            previous: {
              source: 'other',
              data: {},
              formId: 4,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: null
          }
          this.sharedService.isUserDetailUpdated.next(true);
          this.isCompleted.emit(true);
          this.photosData.emit(props);
          this.customerRegistrationService.setRequestStatus(true, 'update');
          this.router.navigateByUrl("/");
        }
      },
      error: (error: any) => {
        this.alert.setAlertMessage('Photos: ' + error?.statusText, AlertType.error);
      }
    })
  }

  getCustomerDetails(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerRegistrationService.getCustomerDetailsById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          this.customerData = data;
          this.imagesData = this.customerData?.photos;
          this.isEditMode = this.customerData && this.customerData['isImagesAdded'] ? true : false;
          if (this.isEditMode) this.getCustomerImages()
          // this.isDataLoaded = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }
}
