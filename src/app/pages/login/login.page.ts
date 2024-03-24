import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { COLOR_SCHEME, inputThemeVariables } from 'src/app/util/theme';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formGroup!: FormGroup;
  fb = inject(FormBuilder);
  router = inject(NavController);

  isLoading: boolean = false;
  isLoggedIn: boolean = false;
  colorScheme: any = COLOR_SCHEME;
  colorVarients: any;
  showPassword: boolean = false;
  passwordToggleIcon = 'eye-outline';
  invalidControl = ' border-red-700 bg-red-200';
  validControl = ' border-gray-300 bg-gray-50';

  constructor() { }

  ngOnInit() {
    this.setCurrentClass();
    this.initFormGroup();
  }

  setCurrentClass() {
    const colorScheme = localStorage.getItem('color-scheme');
    this.colorScheme = colorScheme ? colorScheme : this.colorScheme;
    this.colorVarients = inputThemeVariables[this.colorScheme];
  }

  initFormGroup() {
    this.formGroup = this.fb.group({
      userName: ['', [Validators.required]],
      userPassword: ['', [Validators.required, Validators.minLength(3)]]
    })
  }

  get formGroupControl(): { [key: string]: FormControl } {
    return this.formGroup.controls as { [key: string]: FormControl };
  }

  handleSignIn() {
    const formVal = this.formGroup.value;
  }

  handlePasswordVisiblity() {
    this.showPassword = !this.showPassword;
    this.passwordToggleIcon = this.passwordToggleIcon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline';
  }

  handleRegister() {
    this.router.navigateForward('register');
  }

}
