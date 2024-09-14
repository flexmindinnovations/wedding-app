import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { findInvalidControlsRecursive } from 'src/app/util/theme';
import { Router } from '@angular/router';
import { dropdownValidator } from 'src/app/util/util';

@Component({
  selector: 'other-info',
  templateUrl: './other-info.component.html',
  styleUrls: ['./other-info.component.scss'],
})
export class OtherInfoComponent implements OnInit, AfterViewInit {

  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  isEditMode: boolean = false;
  otherData: any;
  @Output() otherInfoData = new EventEmitter();
  @Output() isCancelled = new EventEmitter();
  @Output() isCompleted = new EventEmitter();

  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);
  cdref = inject(ChangeDetectorRef);

  sharedService = inject(SharedService);
  motherTongueListOptions: any = [];
  motherTongueId: any = '';
  @Output() nextFormStep = new EventEmitter();
  isDataAvailable = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getCustomerDetails();
  }

  ngAfterViewInit(): void {

  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      expectations: ['', [Validators.required]],
      extraInformation: ['', ![Validators.required]],
      motherTongueId: ['', [Validators.required, dropdownValidator()]],
    })
  }

  patchFormData() {
    this.formGroup.patchValue(this.otherData);
    this.cdref.detectChanges();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleClickOnPrevious(src: string) {
    const formVal = this.formGroup.value;
    const props: FormStep = {
      source: src,
      data: formVal,
      formId: 4,
      action: ActionValue.previous,
      isCompleted: false
    }
    this.otherInfoData.emit(props);
  }

  handleCancelAction() {
    this.isCancelled.emit(true);
  }

  onSelectionChange(event: any, src: string) {
    if (src) {
      const motherTongueId = event?.motherTongueId;
      this.motherTongueId = motherTongueId;
    }
  }

  handleClickOnNext(src: string = 'other') {
    const formVal = { ...this.formGroup.value, customerId: this.customerData?.customerId, otherInfoId: 0 };
    if (this.formGroup.valid) {
      if (this.isEditMode) this.updateCustomerInfo(formVal, src);
      else this.saveNewCustomerInfo(formVal, src);
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item, AlertType.error);
      })
    }
  }

  saveNewCustomerInfo(formVal: any, src: string): void {
    this.isDataAvailable = false;
    const payload = { ...formVal, otherInfoId: 0 };
    this.customerRegistrationService.saveOtherInformation(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: { ...formVal, otherInfoId: data?.id },
            formId: 4,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: {
              source: 'contact',
              data: {},
              formId: 3,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: {
              source: 'photos',
              data: {},
              formId: 5,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.sharedService.isUserDetailUpdated.next(true);
          this.isCompleted.emit(true);
          this.otherInfoData.emit(props);
          this.isDataAvailable = true;
          this.router.navigateByUrl("profile/photos");
        }
      },
      error: (error: any) => {
        this.isDataAvailable = true;
        this.alert.setAlertMessage('Other Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    this.isDataAvailable = false;
    const otherInfo = this.customerData['otherInfoModel'];
    const customerId = this.customerData?.customerId;
    const payload = { ...formVal, otherInfoId: otherInfo.otherInfoId };
    this.customerRegistrationService.updateOtherInformation(payload, customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: { ...formVal, otherInfoId: data?.id },
            formId: 4,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: {
              source: 'contact',
              data: {},
              formId: 3,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: {
              source: 'photos',
              data: {},
              formId: 5,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.sharedService.isUserDetailUpdated.next(true);
          this.isCompleted.emit(true);
          this.otherInfoData.emit(props);
          this.isDataAvailable = true;
          this.router.navigateByUrl("profile/photos");
        }
      },
      error: (error: any) => {
        this.isDataAvailable = true;
        this.alert.setAlertMessage('Other Info: ' + error?.statusText, AlertType.error);
      }
    })
  }
  getMotherTongueList() {
    this.sharedService.getMotherTongueList().subscribe({
      next: (data: any) => {
        if (data) {
          this.motherTongueListOptions = data?.map((item: any) => {
            return {
              id: item?.motherTongueId,
              title: item?.motherTongueName,
            }
          });
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }
  getCustomerDetails(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerRegistrationService.getCustomerDetailsById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          this.customerData = data;
          this.otherData = this.customerData['otherInfoModel'];
          this.isEditMode = this.customerData ? this.customerData['isOtherInfoFill'] : false;
          if (this.isEditMode) this.patchFormData();
          this.getMotherTongueList();
          this.isDataAvailable = true;
        }
      },
      error: (error) => {
        this.isDataAvailable = true;
        this.alert.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }
}
