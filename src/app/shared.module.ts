import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CarouselItemComponent } from './components/carousel-item/carousel-item.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { SearchBoxComponent } from './components/search-box/search-box.component';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { CheckboxModule } from 'primeng/checkbox';
import { MessagesModule } from 'primeng/messages';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { PasswordModule } from 'primeng/password';
import { SplitterModule } from 'primeng/splitter';
import { ListboxModule } from 'primeng/listbox';
import { CustomHttpInterceptor } from './interceptors/http.interceptor';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FooterComponent } from './components/footer/footer.component';
import { TmNgOdometerModule } from 'odometer-ngx';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { BadgeModule } from 'primeng/badge';
import { ImageModule } from 'primeng/image';
import { NgScrollbarModule } from 'ngx-scrollbar';

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
  DropdownComponent,
  CarouselComponent,
  CarouselItemComponent,
  SearchBoxComponent,
  FooterComponent,
]

const modules: any = [
  InputTextModule,
  DropdownModule,
  ButtonModule,
  CarouselModule,
  CheckboxModule,
  MessagesModule,
  MenuModule,
  MenubarModule,
  AvatarModule,
  DialogModule,
  PasswordModule,
  SplitterModule,
  ListboxModule,
  CalendarModule,
  InputTextareaModule,
  SelectButtonModule,
  ToggleButtonModule,
  ScrollTopModule,
  ConfirmPopupModule,
  OverlayPanelModule,
  BadgeModule,
  ImageModule,
  TmNgOdometerModule,
  NgScrollbarModule
];

@NgModule({
  declarations: [...components],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ...modules,
    FontAwesomeModule
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    FontAwesomeModule,
    ...modules,
    ...components
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomHttpInterceptor,
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
