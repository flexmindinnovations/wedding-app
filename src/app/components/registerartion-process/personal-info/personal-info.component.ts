import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin, map } from 'rxjs';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { EducationService } from 'src/app/services/education/education.service';
import { HeightService } from 'src/app/services/height/height.service';
import { SharedService } from 'src/app/services/shared.service';
import { COLOR_SCHEME, TITHI_LIST, findInvalidControlsRecursive, getRandomNumber, inputThemeVariables } from 'src/app/util/theme';
import { APP_LOADER } from 'src/app/util/util';


@Component({
  selector: 'personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit, DoCheck, AfterViewInit {

  formGroup!: FormGroup;
  genderOptions: any = [];
  maritalStatusOptions: any = [];
  educationListOptions: any = [];
  heightListOptions: any = [];
  physicalStatusListOptions: any = [];
  specializationListOptions: any = [];
  bloodGroupListOptions: any = [];
  foodPreferencesListOptions: any = [];
  @ViewChild('dropdownInput') dropdownInput: any;
  @Input() customerData: any = null;
  @Input() isReadOnly: any;
  showPatrika: boolean = false;
  spectacles: boolean = false;
  isEditMode: boolean = true;
  isPhysicallyAbled: boolean = false;
  personalData: any;

  @Output() nextFormStep = new EventEmitter();
  @Output() personalInfoData = new EventEmitter();
  @Output() isDataAvailableEvent = new EventEmitter();
  @Output() isCancelled = new EventEmitter();
  @Output() isCompleted = new EventEmitter();
  educationService = inject(EducationService);
  heightService = inject(HeightService);
  alert = inject(AlertService);
  sharedService = inject(SharedService);
  customerRegistrationService = inject(CustomerRegistrationService);
  cdref = inject(ChangeDetectorRef);

  hasSpecialization: boolean = false;
  hasChild: boolean = false;
  isOtherPhyicalCondition: boolean = false;
  occupationListOptions: any = [];
  specializationId = '';
  occupationId = '';
  occupationDetailId = '';
  isDataAvailable = false;
  isOccupationDetailsDataAvailable = false;
  isSpecializationDataAvailable = false;
  tithiList: any[] = TITHI_LIST;
  occupationDetailList: any = [];
  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;
  loaderType = APP_LOADER;
  isDataLoaded: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
    this.setCurrentClass();
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = inputThemeVariables[this.colorScheme];
  }

  ngOnInit() {
    this.initFormGroup();
    this.getCustomerDetails();
    this.genderOptions = [
      { id: 'male', title: 'Male' },
      { id: 'female', title: 'Female' },
    ];

    this.maritalStatusOptions = [
      { id: 'married', title: 'Married' },
      { id: 'single', title: 'Single' },
      { id: 'divorced', title: 'Divorced' },
      { id: 'widowed', title: 'Widowed' }
    ]
  }

  ngOnChanges(changes: SimpleChanges | any): void {
    if (changes?.customerData?.currentValue) {
      this.personalData = JSON.parse(JSON.stringify(this.customerData['personalInfoModel']));
    }
  }

  ngDoCheck(): void {

  }

  ngAfterViewInit(): void {

  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      // customerPassword: ['', ![Validators.required]],
      locationOfBirth: ['', [Validators.required]],
      shakeDate: !['', [Validators.required]],
      gender: ['', [Validators.required]],
      heightId: ['', [Validators.required]],
      educationId: ['', [Validators.required]],
      specializationId: !['', [Validators.required]],
      occupationDetailId: !['', [Validators.required]],
      dateOfBirth: [new Date(), [Validators.required]],
      timeOfBirth: !['', [Validators.required]],
      occupationId: ['', [Validators.required]],
      handycapId: !['', [Validators.required]],
      otherPhysicalText: ['', ![Validators.required]],
      maritalStatus: ['', [Validators.required]],
      hobbies: ['', ![Validators.required]],
      bloodGroupId: !['', ![Validators.required]],
      foodPreferencesId: !['', ![Validators.required]]
    });

    // if (this.isReadOnly) this.formGroup?.disable();
    // else this.formGroup?.enable();

    this.formGroup.valueChanges.subscribe((changes) => {
      this.sharedService.isFormValid.next(this.formGroup.valid);
      this.isCancelled.emit(false);
      this.isCompleted.emit(false);
    })
  }

  handleInputValue(event: any) {
    setTimeout(() => {
      this.formGroup.patchValue({ timeOfBirth: event });
      this.cdref.detectChanges();
    })
  }

  patchValue() {
    this.formGroup.patchValue({
      ...this.personalData,
      dateOfBirth: new Date(this.personalData['dateOfBirth'])
    });

    this.spectacles = this.personalData['spectacles'];
    this.showPatrika = this.personalData['isPatrika'];
    this.isPhysicallyAbled = this.personalData['isPhysicallyAbled'];
    this.tithiList = this.tithiList.map((item: any) => {
      Object.keys(this.personalData).forEach((key: any) => {
        if (item?.title.toLowerCase() === key) {
          item.value = this.personalData[key];
        }
      })
      return item;
    })
    this.cdref.detectChanges();
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleCancelAction() {
    this.isCancelled.emit(true);
  }

  handleClickOnNext(src: string = 'personal') {
    const formVal = this.formGroup.value;
    formVal['specializationId'] = this.specializationId ? this.specializationId : null;
    formVal['occupationId'] = formVal['occupationId'] ? formVal['occupationId'] : null;
    formVal['occupationDetailId'] = this.occupationDetailId ? this.occupationDetailId : null;
    formVal['bloodGroupId'] = formVal['bloodGroupId'] ? formVal['bloodGroupId'] : null;
    formVal['handycapId'] = this.isPhysicallyAbled ? formVal['handycapId'] : null;
    formVal['hobbies'] = formVal['hobbies'] ? formVal['hobbies'] : "";
    formVal['dateOfBirth'] = moment(formVal['dateOfBirth']).format();
    formVal['shakeDate'] = formVal['shakeDate'] ? moment(formVal['shakeDate']).format() : null;
    formVal['customerId'] = this.customerData?.customerId;
    formVal['spectacles'] = this.spectacles;
    formVal['isPatrika'] = this.showPatrika;
    formVal['isPhysicallyAbled'] = this.isPhysicallyAbled;
    formVal['timeOfBirth'] = moment(formVal['timeOfBirth']).format();
    if (this.formGroup.valid) {
      if (this.isEditMode) this.updateCustomerInfo(formVal, src)
      else this.saveNewCustomerInfo(formVal, src)
    } else {
      const invalidFields = findInvalidControlsRecursive(this.formGroup);
      invalidFields.forEach((item: any) => {
        this.alert.setAlertMessage(item, AlertType.error);
      })
    }
  }

  saveNewCustomerInfo(formVal: any, src: string): void {
    this.isDataAvailable = false;
    let payload = { ...formVal, personalInfoId: 0, occupation: "" };
    this.tithiList.forEach((item: any) => {
      payload = { ...payload, [item.title.toLowerCase()]: item.value ? item.value : "" }
    });
    this.customerRegistrationService.savePersonalInformation(payload).subscribe({
      next: (data: any) => {
        if (data) {
          const props: FormStep = {
            source: src,
            data: { ...formVal, customerId: data?.id },
            formId: 1,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: null,
            next: {
              source: 'family',
              data: {},
              formId: 2,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.sharedService.isUserDetailUpdated.next(true);
          this.isCompleted.emit(true);
          this.personalInfoData.emit(props);
          this.nextFormStep.emit('family');
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.isDataAvailable = true;
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.isDataAvailable = true;
        this.alert.setAlertMessage('Personal Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  updateCustomerInfo(formVal: any, src: string): void {
    this.isDataAvailable = false;
    const customerId = this.customerData?.customerId;
    let payload = { ...formVal, personalInfoId: this.personalData.personalInfoId, occupation: "" };
    this.tithiList.forEach((item: any) => {
      payload = { ...payload, [item.title.toLowerCase()]: item.value ? item.value : "" }
    });
    this.customerRegistrationService.updatePersonalInformation(payload, customerId).subscribe({
      next: (data: any) => {
        if (data) {
          const props: FormStep = {
            source: src,
            data: { ...formVal, customerId: customerId },
            formId: 1,
            action: ActionValue.next,
            isCompleted: data?.status,
            previous: null,
            next: {
              source: 'family',
              data: {},
              formId: 2,
              action: ActionValue.next,
              isCompleted: false
            }
          }
          this.sharedService.isUserDetailUpdated.next(true);
          this.isCompleted.emit(true);
          this.personalInfoData.emit(props);
          this.alert.setAlertMessage(data?.message, data?.status === true ? AlertType.success : AlertType.warning);
          this.nextFormStep.emit('family');
          this.isDataAvailable = true;
        }
      },
      error: (error: any) => {
        this.isDataAvailable = true;
        this.alert.setAlertMessage('Personal Info: ' + error?.statusText, AlertType.error);
      }
    })
  }

  getMasterData() {
    const education = this.educationService.getEducationList();
    const height = this.heightService.getHeightList();
    const handycap = this.sharedService.getHandyCapItemList();
    const bloodGroup = this.sharedService.getBloodGroupList();
    const foodPreferences = this.sharedService.getFoodPreferencesList();
    const occupation = this.sharedService.getOccupationList();
    forkJoin({ education, height, handycap, bloodGroup, foodPreferences, occupation })
      .subscribe({
        next: async (result) => {
          if (result) {
            this.isDataAvailable = true;
            const { education, height, handycap, bloodGroup, foodPreferences, occupation } = result;
            this.heightListOptions = height.map((item: any) => {
              return { id: item?.heightId, title: item?.heightName }
            });
            this.educationListOptions = education.map((item: any) => {
              return {
                id: item?.educationId,
                title: item?.educationName,
                hasSpecialization: item?.hasSpecialization
              }
            });
            this.physicalStatusListOptions = handycap.map((item: any) => {
              return {
                id: item?.handycapId,
                title: item?.handycapName,
              }
            });
            this.bloodGroupListOptions = bloodGroup.map((item: any) => {
              return {
                id: item?.bloodGroupId,
                title: item?.bloodGroupName,
              }
            });
            this.foodPreferencesListOptions = foodPreferences.map((item: any) => {
              return {
                id: item?.foodId,
                title: item?.foodName,
              }
            });
            this.occupationListOptions = occupation.map((item: any) => {
              return {
                id: item?.occupationId,
                title: item?.occupationName,
                hasChild: item?.hasChild
              }
            });

            if (this.isEditMode) this.patchValue();
            this.isDataAvailableEvent.emit(true);

            // if (this.isReadOnly === true) this.formGroup?.disable();
            // else this.formGroup?.enable();
            this.cdref.detectChanges();
          }
        },
        error: (error: HttpErrorResponse) => {
          if (error.status !== 401) {
            this.alert.setAlertMessage('Error while processing request', AlertType.error);
          }
        }
      })
  }

  onSelectionChange(event: any, src: string) {
    switch (src) {
      case 'educationId':
        this.hasSpecialization = event?.hasSpecialization;
        if (this.hasSpecialization) this.getSpecialization(event?.id);
        break;
      case 'specializationId':
        const specializationId = event?.specializationId;
        this.specializationId = specializationId;
        break;
      case 'occupationId':
        this.hasChild = event?.hasChild;
        if (this.hasChild) this.getOccupationDetails(event?.id);
        break;
      case 'occupationDetailId':
        const occupationDetailId = event?.occupationDetailId;
        this.occupationDetailId = occupationDetailId;
        break;
      case 'gender':
        break;
      case 'maritalStatus':
        break;
      case 'height':

        break;
      case 'handycapId':
        this.isOtherPhyicalCondition = event?.id === 7;
        break;

    }
  }

  handleSpectacleStateChange(event: any) {
    const value = event?.currentTarget.checked;
    this.spectacles = value;
  }

  isPhysicallyAbledStateChange(event: any) {
    const value = event?.currentTarget.checked;
    this.isPhysicallyAbled = value;
  }

  handlePatrikaStateChange(event: any) {
    this.tithiList.forEach((row: any) => row.tithi = false);
    const value = event?.currentTarget.checked;
    this.showPatrika = value;
  }

  handleTithiStateChange(event: any, item: any) {
    const value = event?.currentTarget.checked;
    item.tithi = value;
  }

  handleOnTithiChange(event: any, item: any) {
    const value = event.target.value;
    item.value = value;
  }

  getSpecialization(educationId: number) {
    this.educationService.getSpecializationListByEducationId(educationId).subscribe({
      next: (data: any) => {
        if (data) {
          this.specializationListOptions = data.map((item: any) => {
            return {
              id: item?.specializationId,
              title: item?.specializationName,
              educationId,
              specializationId: item?.specializationId
            }
          });
          this.isSpecializationDataAvailable = true;
        }
      },
      error: (error) => {
        this.alert.setAlertMessage(error?.message, AlertType.error);
      }
    })
  }
  getOccupationDetails(occupationId: number) {
    this.sharedService.getOccupationById(occupationId).subscribe({
      next: (data: any) => {
        if (data) {
          this.occupationDetailList = data?.occupationDetailList?.map((item: any) => {
            return {
              id: item?.occupationDetailId,
              title: item?.occupationDetailName,
              occupationId,
              occupationDetailId: item?.occupationDetailId
            }
          });
          this.isOccupationDetailsDataAvailable = true;
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
          this.personalData = this.customerData['personalInfoModel'];
          this.isEditMode = this.customerData ? this.customerData['isPersonInfoFill'] : false;
          this.getMasterData();
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
