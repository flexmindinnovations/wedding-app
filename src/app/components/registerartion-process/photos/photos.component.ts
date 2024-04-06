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
export class PhotosComponent implements OnInit, AfterViewInit, OnChanges {
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
  selectedFiles: any[] = [];

  thumbnailImage = '';
  photo1 = '';
  customerId: number = 0;
  router = inject(Router);

  sharedService = inject(SharedService);
  @Output() nextFormStep = new EventEmitter();

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.customerData?.currentValue) this.imagesData = this.customerData?.photos;
  }

  ngOnInit() { }

  ngAfterViewInit(): void {
    this.isEditMode = this.customerData && this.customerData['isImagesAdded'];
    if (this.isEditMode) this.getCustomerImages();

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
      // if (this.formGroup.valid) {
      //   this.handleClickOnNext(event);
      // } else {
      //   this.sharedService.isFormValid.next(this.formGroup.valid);
      // }
    })
  }

  getCustomerImages() {
    const imageInfoModel = this.customerData && this.customerData['imageInfoModel'];
    if (imageInfoModel) {
      this.thumbnailImage = `${environment.endpoint}/${imageInfoModel?.imagePath1}`;
      this.photo1 = `${environment.endpoint}/${imageInfoModel?.imagePath2}`;
      this.cdref.detectChanges();
    }
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
    if (this.isEditMode) this.updateCustomerInfo(src);
    else this.saveNewCustomerInfo(src);
  }


  saveNewCustomerInfo(src: string): void {
    const customerId = this.customerData?.customerId || 0;
    const formData: FormData = new FormData();
    formData.append('customerId', customerId);
    this.selectedFiles.forEach((file: any) => {
      formData.append('file', file, file.name);
    })
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
          this.isCompleted.emit(true);
          this.photosData.emit(props);
          this.router.navigateByUrl('customers');
          this.customerRegistrationService.setRequestStatus(true, 'add');
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Photos: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(src: string): void {
    const customerId = this.customerData?.customerId;
    const formData: FormData = new FormData();
    formData.append('customerId', customerId);
    this.selectedFiles.forEach((file: any) => {
      formData.append('file', file, file.name);
    })
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
          this.isCompleted.emit(true);
          this.photosData.emit(props);
          this.router.navigateByUrl('customers');
          this.customerRegistrationService.setRequestStatus(true, 'update');
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alert.setAlertMessage('Photos: ' + error?.statusText, AlertType.error);
      }
    })
  }
}
