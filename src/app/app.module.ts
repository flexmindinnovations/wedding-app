import { APP_INITIALIZER, inject, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from './shared.module';
import { StoreModule } from '@ngrx/store';
import { dataReducer } from './store.reducer';
import { DOMAIN } from './util/theme';
import { AuthService } from './services/auth/auth.service';
import { CustomerRegistrationService } from './services/customer-registration.service';
import { utils } from './util/util';
import { AlertService } from './services/alert/alert.service';
import { AlertType } from './enums/alert-types';

export function configFactory(
  authService: AuthService,
  customerRegistrationService: CustomerRegistrationService,
  alertService: AlertService
): Promise<any> {
  return new Promise((resolve, reject) => {
    const isLoggedIn = authService.isLoggedIn();
    console.log('isLoggedIn: ', isLoggedIn);
    if (isLoggedIn) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      customerRegistrationService.getCustomerDetailsById(user.user).subscribe({
        next: (data: any) => {
          if (data) {
            utils.userDetails.set(data);
            resolve(data);
          }
        },
        error: (error) => {
          console.log('error: ', error);
          alertService.setAlertMessage('Error: ' + error, AlertType.error);
        }
      })
    } else {
      resolve({});
    }
  })
}


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, SharedModule,
    StoreModule.forRoot({ data: dataReducer }),
    BrowserAnimationsModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APP_INITIALIZER,
      useFactory: (
        authService: AuthService,
        customerRegistrationService: CustomerRegistrationService,
        alertService: AlertService
      ) => () => configFactory(
        authService,
        customerRegistrationService,
        alertService
      ),
      deps: [AuthService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
