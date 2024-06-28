import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';

import { LoginPage } from './login.page';
import { SharedModule } from 'src/app/shared.module';
import { MessageService } from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    LoginPageRoutingModule
  ],
  declarations: [LoginPage],
  providers: [MessageService]
})
export class LoginPageModule {}
