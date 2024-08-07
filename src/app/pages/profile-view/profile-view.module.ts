import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileViewPageRoutingModule } from './profile-view-routing.module';

import { ProfileViewPage } from './profile-view.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ProfileViewPageRoutingModule
  ],
  exports: [ProfileViewPage],
  declarations: [ProfileViewPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProfileViewPageModule { }
