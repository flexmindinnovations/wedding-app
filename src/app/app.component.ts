import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import * as AOS from 'aos';
import { AlertType } from './enums/alert-types';
import { AlertService } from './services/alert/alert.service';
import { COLOR_SCHEME } from './util/theme';
import { Spinkit } from 'ng-http-loader';
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

  public spinkit = Spinkit;
  loaderTheme = (COLOR_SCHEME as 'br') ? '#1e9aff' : (COLOR_SCHEME as 'bo') ? '#ff7f0a' : '#3d51e6';

  constructor() { }

  ngOnInit() {
    AOS.init();
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
