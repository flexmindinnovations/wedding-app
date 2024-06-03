import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfilePage } from './profile.page';
import { PersonalInfoComponent } from 'src/app/components/registerartion-process/personal-info/personal-info.component';
import { FamilyInfoComponent } from 'src/app/components/registerartion-process/family-info/family-info.component';
import { ContactInfoComponent } from 'src/app/components/registerartion-process/contact-info/contact-info.component';
import { OtherInfoComponent } from 'src/app/components/registerartion-process/other-info/other-info.component';
import { PhotosComponent } from 'src/app/components/registerartion-process/photos/photos.component';
import { PaymentInfoComponent } from 'src/app/components/registerartion-process/payment-info/payment-info.component';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    children: [
      {
        path: 'personal',
        component: PersonalInfoComponent
      },
      {
        path: 'family',
        component: FamilyInfoComponent
      },
      {
        path: 'contact',
        component: ContactInfoComponent
      },
      {
        path: 'other',
        component: OtherInfoComponent
      },
      {
        path: 'photos',
        component: PhotosComponent
      },
      {
        path: 'payment',
        component: PaymentInfoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule { }
