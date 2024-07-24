import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { LayoutPageRoutingModule } from './layout-routing.module';

import { LayoutPage } from './layout.page';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouteReuseStrategy } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { customInterceptor } from 'src/app/interceptors/http.interceptor';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LayoutPageRoutingModule,
    SharedModule
  ],
  declarations: [LayoutPage],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: customInterceptor,
      multi: true
    }
  ]
})
export class LayoutPageModule { }
