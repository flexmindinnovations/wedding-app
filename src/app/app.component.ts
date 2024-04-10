import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import * as AOS from 'aos';
import { AlertType } from './enums/alert-types';
import { AlertService } from './services/alert/alert.service';
import { AUTO_DISMISS_TIMER, COLOR_SCHEME } from './util/theme';
import { Spinkit } from 'ng-http-loader';
import { CustomLoaderComponent } from './components/custom-loader/custom-loader.component';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  isLightMode = true;

  alertService = inject(AlertService);
  alertData: any;
  alertType: AlertType = 1;
  alertMessage: string = '';
  showAlert: boolean = false;

  loaderComponent = CustomLoaderComponent;

  public spinkit = Spinkit;
  loaderTheme = (COLOR_SCHEME as 'br') ? '#1e9aff' : (COLOR_SCHEME as 'bo') ? '#ff7f0a' : '#3d51e6';

  constructor() { }

  ngOnInit() {
    AOS.init();
    this.alertService.getAlertMessage().subscribe((data: any) => {
      this.showAlert = true;
      this.alertMessage = data?.message;
      this.alertType = data?.type;
      this.alertData = data ? true : false;
      setTimeout(() => {
        this.showAlert = false;
      }, AUTO_DISMISS_TIMER);
    })
  }

  ngAfterViewInit(): void {
    this.isLightMode = localStorage.getItem('color-theme') === 'dark' ? false : true;
    if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
