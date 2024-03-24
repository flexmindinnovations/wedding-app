import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { LayoutPageRoutingModule } from './layout-routing.module';

import { LayoutPage } from './layout.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouteReuseStrategy } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FontAwesomeModule,
    LayoutPageRoutingModule,
    SharedModule
  ],
  declarations: [LayoutPage],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }]
})
export class LayoutPageModule { }
