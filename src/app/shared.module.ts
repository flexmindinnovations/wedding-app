import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IonicModule } from '@ionic/angular';
import { FormStepperComponent } from './components/form-stepper/form-stepper.component';
import { PersonalInfoComponent } from './components/registerartion-process/personal-info/personal-info.component';
import { FamilyInfoComponent } from './components/registerartion-process/family-info/family-info.component';
import { ContactInfoComponent } from './components/registerartion-process/contact-info/contact-info.component';
import { OtherInfoComponent } from './components/registerartion-process/other-info/other-info.component';
import { PhotosComponent } from './components/registerartion-process/photos/photos.component';
import { InputComponent } from './components/input/input.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { ButtonComponent } from './components/button/button.component';
import { AlertComponent } from './components/alert/alert.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { HttpClientModule } from '@angular/common/http';


const components = [
  FormStepperComponent,
  PersonalInfoComponent,
  FamilyInfoComponent,
  ContactInfoComponent,
  OtherInfoComponent,
  PhotosComponent,
  InputComponent,
  TimePickerComponent,
  ButtonComponent,
  AlertComponent,
  ImagePickerComponent,
  DropdownComponent
]

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FontAwesomeModule,
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FontAwesomeModule,
    ...components
  ]
})
export class SharedModule { }
