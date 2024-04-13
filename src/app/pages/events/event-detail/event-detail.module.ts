import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventDetailPageRoutingModule } from './event-detail-routing.module';

import { EventDetailPage } from './event-detail.page';
import { QuillModule } from 'ngx-quill';
import { EventContentComponent } from './event-content/event-content.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuillModule.forRoot(),
    EventDetailPageRoutingModule
  ],
  declarations: [EventDetailPage, EventContentComponent]
})
export class EventDetailPageModule { }
