import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfileHistoryPageRoutingModule } from './profile-history-routing.module';

import { ProfileHistoryPage } from './profile-history.page';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    ProfileHistoryPageRoutingModule
  ],
  declarations: [ProfileHistoryPage]
})
export class ProfileHistoryPageModule {}
