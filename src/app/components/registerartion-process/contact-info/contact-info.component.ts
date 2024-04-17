import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { findInvalidControlsRecursive } from 'src/app/util/theme';

@Component({
  selector: 'contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss'],
})
export class ContactInfoComponent implements OnInit, AfterViewInit {

  @Input() completedStep!: FormStep;
  formGroup!: FormGroup;
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  isEditMode: boolean = true;
  contactData: any;
  @Output() contactInfoData = new EventEmitter();
  @Output() isCancelled = new EventEmitter();
  @Output() isCompleted = new EventEmitter();

  isCountryListAvailable = false;
  isStateListAvailable = false;
  isCityListAvailable = false;
  isDataAvailable = false;

  alert = inject(AlertService);
  customerRegistrationService = inject(CustomerRegistrationService);
  sharedService = inject(SharedService);
  cdref = inject(ChangeDetectorRef);

  countryList: any = [];
  stateList: any = [];
  cityList: any = [];

  @Output() nextFormStep = new EventEmitter();

  constructor(
    private fb: FormBuilder
  ) {
  }

  ngOnInit() {
    this.initFormGroup();
    this.getCustomerDetails();
  }

  // ngOnChanges(changes: SimpleChanges | any): void {
  //   if (changes?.customerData?.currentValue) this.contactData = this.customerData['contactInfoModel'];
  // }

  ngAfterViewInit(): void {

  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      // contactOf: ['', [Validators.required]],
      contactNumber: ['', [Validators.required]],
      whatsUpNumber: ['', [Validators.required]],
      emailId: ['', [Validators.required]],
      homeAddress: ['', [Validators.required]],
      countryId: ['', [Validators.required]],
      stateId: ['', [Validators.required]],
      cityId: ['', [Validators.required]],
    })
    this.getCountryList();

  }

  patchFormData() {
    this.isDataAvailable = false;
    const contactData = { ...this.contactData, contactNumber: this.customerData['customerUserName'] };
    this.formGroup.patchValue(contactData)
    this.cdref.detectChanges();
    this.formGroup.get('contactNumber')?.disable();
    this.isDataAvailable = true;
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }


  handleCancelAction() {
    this.isCancelled.emit(true);
  }

  handleClickOnNext(src: string = 'contact') {
    const formVal = { ...this.formGroup.value, customerId: this.customerData?.customerId, contactInfoId: 0 };
    if (this.formGroup.valid) {
      if (this.isEditMode) this.updateCustomerInfo(formVal, src);
      else this.saveNewCustomerInfo(formVal, src);
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item + ' is required', AlertType.error);
      })
    }
  }

  saveNewCustomerInfo(formVal: any, src: string): void {
    this.isDataAvailable = false;
    const payload = { ...formVal, contactInfoId: 0 };
    this.customerRegistrationService.saveContactInformation(payload).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: { ...formVal, contactInfoId: data?.id },
            formId: 3,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: {
              source: 'family',
              data: {},
              formId: 2,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: {
              source: 'other',
              data: {},
              formId: 4,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.sharedService.isUserDetailUpdated.next(true);
          this.isCompleted.emit(true);
          this.contactInfoData.emit(props);
          this.isDataAvailable = true;
        }
      },
      error: (error: any) => {
        this.isDataAvailable = true;
        this.alert.setAlertMessage('Contact Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    this.isDataAvailable = false;
    const contactInfo = this.customerData['contactInfoModel'];
    const customerId = this.customerData?.customerId;
    const payload = { ...formVal, contactInfoId: contactInfo.contactInfoId };
    this.customerRegistrationService.updateContactInformation(payload, customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          const props: FormStep = {
            source: src,
            data: { ...formVal, contactInfoId: data?.id },
            formId: 3,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: {
              source: 'family',
              data: {},
              formId: 2,
              action: ActionValue.previous,
              isCompleted: true
            },
            next: {
              source: 'other',
              data: {},
              formId: 4,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.sharedService.isUserDetailUpdated.next(true);
          this.isCompleted.emit(true);
          this.contactInfoData.emit(props);
          this.isDataAvailable = true;
        }
      },
      error: (error: any) => {
        this.isDataAvailable = true;
        this.alert.setAlertMessage('Contact Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  onSelectionChange(event: any, src: string) {
    switch (src) {
      case 'countryId':
        this.getStateByCountry(event?.id);
        break;
      case 'stateId':
        this.getCityByState(event?.id);
        break;
    }
  }

  getCountryList() {
    this.sharedService.getCountryList().subscribe({
      next: (data: any) => {
        if (data) {
          this.countryList = data?.map((item: any) => {
            const obj = {
              id: item?.countryId,
              title: item?.countryName
            }
            return obj;
          });
          this.isCountryListAvailable = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);

      }
    })
  }

  getStateByCountry(countryId: number) {
    if (countryId) {
      this.stateList = [];
      this.cityList = [];
      this.sharedService.getStatByCountry(countryId).subscribe({
        next: (data: any[]) => {
          if (data) {
            this.stateList = data?.map((item: any) => {
              const obj = {
                id: item?.stateId,
                title: item?.stateName
              }
              return obj;
            });
            this.isStateListAvailable = true;
          }
        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }

  }
  getCityByState(stateId: number) {
    this.cityList = [];
    if (stateId) {
      this.sharedService.getCityByState(stateId).subscribe({
        next: (data: any[]) => {
          if (data) {
            this.cityList = data?.map((item: any) => {
              const obj = {
                id: item?.cityId,
                title: item?.cityName
              }
              return obj;
            });
            this.isCityListAvailable = true;
          }
        },
        error: (error) => {
          console.log('error: ', error);

        }
      })
    }
  }
  getCustomerDetails(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerRegistrationService.getCustomerDetailsById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          this.customerData = data;
          this.contactData = this.customerData['contactInfoModel'];
          this.isEditMode = this.customerData && this.customerData['isContactInfoFill'] ? true : false;
          if (this.contactData) {
            this.patchFormData();
          }
          this.isDataAvailable = true;
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.isDataAvailable = true;
        this.alert.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }

}
