import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventDetailPage } from './event-detail.page';
import { EventContentComponent } from './event-content/event-content.component';


const routes: Routes = [
  {
    path: '',
    component: EventDetailPage,
    children: [
      {
        path: ':id',
        component: EventContentComponent
      },
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventDetailPageRoutingModule { }
