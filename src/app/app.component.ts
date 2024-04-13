import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import * as AOS from 'aos';
import { AUTO_DISMISS_TIMER, COLOR_SCHEME } from './util/theme';
import { Spinkit } from 'ng-http-loader';
import { CustomLoaderComponent } from './components/custom-loader/custom-loader.component';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  isLightMode = true;
  key = uuidv4();

  loaderComponent = CustomLoaderComponent;

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
