import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Message } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DOMAIN } from 'src/app/util/theme';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.scss'],
})
export class RegisterUserComponent implements OnInit, OnDestroy {

  formGroup!: FormGroup;
  validationMessages: Message[] = [];
  showSuccessDialog: boolean = false;
  domain = DOMAIN;
  username: any;
  showLoader = false;
  showRegisterLoader = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alert: AlertService,
    private router: Router,
    private dialogService: DialogService,
    private dialogConfig: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef
  ) { }

  ngOnInit() {
    this.initFormGroup();
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      customerUserName: ['', [Validators.required]],
      customerPassword: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]
    },
      {
        validators: this.confirmedValidator('customerPassword', 'confirmPassword'),
      }
    )

    this.formGroup.valueChanges.subscribe((customerPassword: any) => {
      setTimeout(() => {
        this.validationMessages = [];
      }, 1000)
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  confirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ notSame: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }


  handleSignUpClick() {
    if (this.formGroup.invalid) {
      Object.keys(this.formGroup.controls).forEach((control: any) => {
        const formControl = this.formGroupControl[control];
        this.validateFormFields(formControl, control);
      })
      return;
    }
    this.showRegisterLoader = true;
    const formValue = this.formGroup.value;
    this.username = formValue['customerUserName'];
    const payload = {
      customerUserName: this.username,
      customerPassword: formValue['customerPassword']
    }
    this.authService.signUp(payload).subscribe({
      next: (data: any) => {
        if (data) {
          console.log('data: ', data);
          if (data?.status === true) {
            this.showRegisterLoader = false;
            this.alert.setAlertMessage(data?.message, AlertType.success);
            this.showSuccessDialog = true;
          }
        }
      },
      error: (error: any) => {
        console.log('error: ', error);
        const err = error?.error;
        console.log('err: ', err);
        this.showRegisterLoader = false;
        this.alert.setAlertMessage(err?.message, AlertType.error);
      }
    })
  }

  validateFormFields(control: FormControl, controlName: string) {
    let message: any = '';
    if (control.invalid) {
      if (control.hasError('required')) {
        message = `${this.getControlName(controlName)} is required`;
        if (!this.hasErrorMessage(message)) {
          this.validationMessages = [
            ...this.validationMessages,
            { severity: 'error', summary: 'Error', detail: message }
          ]
        }
      } else if (control.hasError('min')) {
        message = `${this.getControlName(controlName)} does not satisfy minimum length required condition`;
        if (!this.hasErrorMessage(message)) {
          this.validationMessages = [
            ...this.validationMessages,
            { severity: 'error', summary: 'Error', detail: message }
          ]
        }
      } else if (control.hasError('max')) {
        message = `${this.getControlName(controlName)} does not satisfy maximum length required condition`;
        if (!this.hasErrorMessage(message)) {
          this.validationMessages = [
            ...this.validationMessages,
            { severity: 'error', summary: 'Error', detail: message }
          ]
        }
      } else if (control.hasError('notSame')) {
        message = `Password and confirm password is not same`;
        if (!this.hasErrorMessage(message)) {
          this.validationMessages = [
            ...this.validationMessages,
            { severity: 'error', summary: 'Error', detail: message }
          ]
        }
      }
    }
  }

  hasErrorMessage(message: string) {
    const strippedMessage = message.toLowerCase().replace(/\s/g, "");
    const indexOfItem = this.validationMessages.findIndex((each: any) => each.detail.toLowerCase().replace(/\s/g, "") === strippedMessage
    );
    if (indexOfItem > -1) {
      return true;
    }
    return false;
  }

  getControlName(controlName: any) {
    let fieldName: string = '';
    switch (controlName) {
      case 'customerUserName':
        fieldName = 'Mobile number';
        break;
      case 'customerPassword':
        fieldName = 'Password';
        break;
      case 'confirmPassword':
        fieldName = 'Confirm password';
        break;
    }
    return fieldName;
  }

  handleLogin() {
    this.showLoader = true;
    setTimeout(() => {
      this.showSuccessDialog = false;
      this.dialogRef.close();
      this.router.navigateByUrl('login');
    }, 500)
  }

  ngOnDestroy(): void {
    this.validationMessages = [];
  }
}
