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
import { customInterceptor } from './interceptors/http.interceptor';
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
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { NgHttpLoaderModule } from "ng-http-loader";
import { CustomLoaderComponent } from './components/custom-loader/custom-loader.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SidebarModule } from 'primeng/sidebar';
import { RegisterUserComponent } from './modals/register-user/register-user.component';
import { DialogService, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { CardComponent } from './components/card/card.component';
import { DataExportComponent } from './components/data-export/data-export.component';
import { TableModule } from 'primeng/table';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { AnimateOnScrollModule } from 'primeng/animateonscroll';
import { ToolbarModule } from 'primeng/toolbar';
import { DividerModule } from 'primeng/divider';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { ProfileViewPage } from './pages/profile-view/profile-view.page';
import { PricingComponent } from './components/pricing/pricing.component';
import { LikedProfilesComponent } from './modals/liked-profiles/liked-profiles.component';
import { CardModule } from 'primeng/card';
import { PaymentInfoComponent } from './components/registerartion-process/payment-info/payment-info.component';
import { HomePageWrapperComponent } from './components/home-page-wrapper/home-page-wrapper.component';

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
  CustomLoaderComponent,
  RegisterUserComponent,
  CardComponent,
  DataExportComponent,
  VideoPlayerComponent,
  PricingComponent,
  PaymentInfoComponent,
  LikedProfilesComponent,
  HomePageWrapperComponent
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
  ToastModule,
  TmNgOdometerModule,
  NgScrollbarModule,
  SidebarModule,
  DynamicDialogModule,
  FieldsetModule,
  TableModule,
  ToolbarModule,
  AnimateOnScrollModule,
  DividerModule,
  NgHttpLoaderModule.forRoot(),
  // for Router use:
  LoadingBarRouterModule,
  // for Core use:
  LoadingBarModule,
  NgxDocViewerModule,
  CardModule
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
    FontAwesomeModule,
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
    MessageService,
    DialogService,
    DynamicDialogRef,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SharedModule { }
