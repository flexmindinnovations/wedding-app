import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AlertType } from 'src/app/enums/alert-types';
import { ActionValue, FormStep } from 'src/app/interfaces/form-step-item';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { SharedService } from 'src/app/services/shared.service';
import { DOMAIN } from 'src/app/util/theme';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  personalDetailsFormGroup!: FormGroup;
  contactDetailsFormGroup !: FormGroup;
  completedStep!: FormStep;
  currentForm: number = 1;
  isEditMode: boolean = false;
  customerId = 0;
  customerDetails: any = null;
  isDataLoaded = false;

  router = inject(Router);
  customerService = inject(CustomerRegistrationService);
  deviceService = inject(DeviceDetectorService);
  fb = inject(FormBuilder);
  activeRouter = inject(ActivatedRoute);
  alertService = inject(AlertService);
  sharedService = inject(SharedService);
  currentFormName: string = 'personal';
  isFormValid = false;
  isLastStep: boolean = false;
  isDataAvailable: boolean = false;
  isConfirmed: boolean = false;
  host = inject(ElementRef);
  ngZone = inject(NgZone);
  isMobileDevice: boolean = false;
  isDesktop: boolean = true;

  domainName = DOMAIN;

  @Output() nextButtonClick: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    this.initFormGroup();
  }

  ngAfterViewInit(): void {
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isMobileDevice = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);

    this.activeRouter.params.subscribe((params: any) => {
      this.customerId = params && params['id'] ? params['id'] : 0;
      if (this.customerId > 0) this.getCustomerDetails();
      else this.isDataLoaded = true;
    })

    this.sharedService.getIsFormValid().subscribe((isValid) => {
      this.isFormValid = isValid;
    })
  }

  initFormGroup() {
    this.personalDetailsFormGroup = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      surName: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      height: ['', [Validators.required]],
      education: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      physicalStatus: ['', [Validators.required]],
      maritalStatus: ['', [Validators.required]],
      hobbies: ['', ![Validators.required]]
    })
  }

  get personalFormControl(): { [key: string]: FormControl } {
    return this.personalDetailsFormGroup.controls as { [key: string]: FormControl };
  }

  handleOnDataAvailable(event: any) {
    this.isDataAvailable = event;
  }

  handleRefresh(event: any) {
    console.log('handleRefresh: ', event);
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
    }, 2000);
  }

  getCustomerDetails(): void {
    this.customerService.getCustomerDetailsById(this.customerId).subscribe({
      next: (data: any) => {
        if (data) {
          this.customerDetails = data;
          this.isDataLoaded = true;
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }

  handleClickOnNext(data: FormStep) {
    this.completedStep = data;
    if (data.action === ActionValue.next) {
      if (this.completedStep.formId === 5) {
        this.currentForm = this.completedStep.formId;
        return;
      } else {
        this.currentForm = this.completedStep.formId + 1;
      }
    } else {
      if (data.formId === 1) {
        this.currentForm = this.completedStep.formId;
        return;
      } else {
        this.currentForm = this.completedStep.formId - 1;
      }
    }
  }

  setNextFormStep(nextStep: any) {
    if (nextStep) this.currentFormName = nextStep;
    this.isLastStep = nextStep === 'photo' ? true : false;
  }

  handleNextClick() {
    this.sharedService.nextButtonClick.next(this.currentFormName);
  }

  handleContinueClick() {
    this.isConfirmed = true;
  }

  ngOnDestroy(): void { }

}
