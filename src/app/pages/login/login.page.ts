import { Component, ElementRef, OnInit, inject, HostListener, HostBinding, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, Platform } from '@ionic/angular';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MessageService } from 'primeng/api';
import { delay, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth//auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { COLOR_SCHEME, inputThemeVariables } from 'src/app/util/theme';
import { Store } from '@ngrx/store';
import { saveData } from 'src/app/store.actions';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';
import { animate, group, query, style, transition, trigger } from '@angular/animations';


export enum ValidationStep {
  'FIRST' = 'first',
  'SECOND' = 'second',
  'THIRD' = 'third'
}

let presentStep = ValidationStep.FIRST;
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('fadeInLeft', [
      transition(':leave', [
        style({ opacity: 1, transform: 'translateX(0%)' }),
        animate('300ms ease-in-out', style({ opacity: presentStep === ValidationStep.FIRST ? 1 : 0, transform: presentStep === ValidationStep.FIRST ? 'translateX(0%)' : 'translateX(-100%)' }))
      ]),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('300ms 300ms ease-in-out', style({ opacity: 1, transform: 'translateX(0%)' }))
      ])
    ]),
    trigger('growHeight', [
      transition('void <=> *', []),
      transition('* <=> *', [
        style({ height: '{{initialHeight}}px', opacity: 0 }),
        animate('.5s ease'),
      ], { params: { initialHeight: 0 } }
      )
    ])
  ]
})
export class LoginPage implements OnInit {

  formGroup!: FormGroup;
  fb = inject(FormBuilder);
  router = inject(NavController);
  deviceService = inject(DeviceDetectorService);
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  alert = inject(AlertService);
  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;
  showPassword: boolean = false;
  passwordToggleIcon = 'eye-outline';
  invalidControl = ' border-red-700 bg-red-200';
  validControl = ' border-gray-300 bg-gray-50';
  userName = '';
  userPassword = '';
  host = inject(ElementRef);
  isMobile: boolean = false;
  dialogRef: DynamicDialogRef | undefined;
  showResetPasswordPopup: boolean = false;
  public screenWidth: any;
  isResetFormLoading = false;
  validationSteps = ValidationStep;
  currentStep = ValidationStep.FIRST;
  isEmailAvailable: boolean = false;
  otpValue: any;
  resetPasswordEmail: string = '';
  initialHeight: number = 0;
  resetPasswordFormGroup!: FormGroup;
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }
  // @ViewChild('resetPassowrd', { static: false }) dynamicHeightPopup!: ElementRef;
  // @HostBinding('@growHeight') get growHeight() {
  //   return { params: { initialHeight: this.initialHeight } };
  // }

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService,
  ) { }

  ngOnInit() {
    // this.initialHeight = this.dynamicHeightPopup.nativeElement.clientHeight;
    this.setCurrentClass();
    this.initFormGroup();
    this.initResetFormGroup();


    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isMobile = this.deviceService.isMobile();
      })
    });

    observer.observe(this.host.nativeElement);
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = inputThemeVariables[this.colorScheme];
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      customerUserName: ['', [Validators.required]],
      customerPassword: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  initResetFormGroup() {
    this.resetPasswordFormGroup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      emailOtp: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  get resetPasswordFormGroupControl(): { [key: string]: FormControl } {
    return this.resetPasswordFormGroup.controls as { [key: string]: FormControl };
  }

  handleSignIn() {
    const formVal = this.formGroup.value;
    this.isLoading = true;
    this.formGroup.disable();
    this.authService.loginCustomer(formVal).subscribe({
      next: (response) => {
        if (response) {
          const data = response?.customerResponse;
          const { token, customerId, profileStatus, isFamilyInfoFill, isImagesAdded, isOtherInfoFill, isPersonInfoFill, isContactInfoFill } = data;
          localStorage.setItem('user', JSON.stringify({ user: customerId, profileStatus }));
          localStorage.setItem('token', token);
          this.sharedService.userDetails.set(data);
          this.alert.setAlertMessage('User authenticated successfully', AlertType.success);
          of(true)
            .pipe(
              delay(500)
            ).subscribe(() => {
              this.isLoading = false;
              this.isLoggedIn = true;
              of(true).
                pipe(
                  delay(1000)
                ).subscribe(() => {
                  this.messageService.clear();
                  this.router.navigateForward('');
                  sessionStorage.setItem('isLoggedInCompleted', 'true');
                  setTimeout(() => {
                    this.sharedService.isLoggedInCompleted.next(true);
                  }, 500);
                });
            });
        }
      },
      error: (error: any) => {
        const err = error?.error;
        const errorMessage = err.message ? err?.message : 'Something went wrong';
        this.alert.setAlertMessage(errorMessage, AlertType.error);
        of(true)
          .pipe(
            delay(1000)
          ).subscribe(() => {
            this.isLoading = false;
            this.isLoggedIn = false;
            this.formGroup.enable();
          });
      }
    })
  }

  showAlert(message: string, type: string) {
    this.messageService.add({ severity: type, summary: type === 'success' ? 'Success' : 'Error', detail: message });
  }

  handlePasswordVisiblity(event?: any) {
    this.showPassword = event;
  }


  handleResetPassword() {
    // this.initResetFormGroup();
    this.showResetPasswordPopup = true;
  }

  handlePopupCancel() {
    this.currentStep = ValidationStep.FIRST;
    this.showResetPasswordPopup = false;
    this.isResetFormLoading = false;
  }

  processResetPasswordForm() {
    this.isResetFormLoading = true;
    switch (this.currentStep) {
      case ValidationStep.FIRST:
        setTimeout(() => {
          this.currentStep = ValidationStep.SECOND;
          this.isResetFormLoading = false;
        }, 1500);
        break;
      case ValidationStep.SECOND:
        setTimeout(() => {
          this.currentStep = ValidationStep.THIRD;
          this.isResetFormLoading = false;
        }, 1500);

        break;
    }
    presentStep = this.currentStep;
  }

  getStepNumber() {
    let stepNumber = 1;
    switch (this.currentStep) {
      case ValidationStep.FIRST:
        stepNumber = 1;
        break;
      case ValidationStep.SECOND:
        stepNumber = 2;
        break;
      case ValidationStep.THIRD:
        stepNumber = 3;
        break;
    }
    return stepNumber;
  }

  callResetPasswordApi() {

  }


  getButtonTitle() {
    let buttonTitle = 'Next';
    switch (this.currentStep) {
      case ValidationStep.FIRST:
        buttonTitle = 'Next';
        break;
      case ValidationStep.SECOND:
        buttonTitle = 'Validate OTP';
        break;
      case ValidationStep.THIRD:
        buttonTitle = 'Update Password';
        break;
      default:
        buttonTitle = 'Next';
        break;
    }

    return buttonTitle;
  }

  validateForm() {
    if (this.formGroup.get('userName')?.touched && this.formGroup.get('userName')?.invalid) {
      // notify("Please enter username", "warning", 500);
    } else if (this.formGroup.get('userPassword')?.touched && this.formGroup.get('userName')?.invalid) {
      // notify("Please enter password", "warning", 500);
    }
  }

  handleRegister() {
    this.dialogRef = this.dialogService.open(RegisterUserComponent, {
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

  getSeverity() {
    let severity = '';
    if (this.isLoading) {
      severity = 'secondary';
    } else if (this.isLoggedIn) {
      severity = 'success';
    } else {
      severity = '';
    }
    return severity;
  }

  getIcon() {
    let icon = '';
    if (this.isLoading) {
      icon = 'pi pi-spin pi-spinner';
    } else if (this.isLoggedIn) {
      icon = 'pi pi-check';
    } else {
      icon = 'pi pi-lock';
    }
    return icon;
  }

  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }
  }

}
