import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileFilterPageRoutingModule } from './profile-filter-routing.module';

import { ProfileFilterPage } from './profile-filter.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ProfileFilterPageRoutingModule
  ],
  declarations: [ProfileFilterPage]
})
export class ProfileFilterPageModule {}
