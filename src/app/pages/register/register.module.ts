import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { SharedModule } from 'src/app/shared.module';
import { PersonalInfoComponent } from 'src/app/components/registerartion-process/personal-info/personal-info.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({ declarations: [RegisterPage], imports: [CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RegisterPageRoutingModule,
        SharedModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class RegisterPageModule {}
