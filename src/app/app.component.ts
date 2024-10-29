import { AfterViewInit, Component, ElementRef, OnInit, inject } from '@angular/core';
// import * as AOS from 'aos';
import { AUTO_DISMISS_TIMER, COLOR_SCHEME } from './util/theme';
import { Spinkit } from 'ng-http-loader';
import { CustomLoaderComponent } from './components/custom-loader/custom-loader.component';
import { v4 as uuidv4 } from 'uuid';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  isLightMode = true;
  isDesktopMode = true;
  key = uuidv4();

  loaderComponent = CustomLoaderComponent;
  host = inject(ElementRef);
  deviceService = inject(DeviceDetectorService);

  public spinkit = Spinkit;
  loaderTheme = (COLOR_SCHEME as 'br') ? '#1e9aff' : (COLOR_SCHEME as 'bo') ? '#ff7f0a' : '#3d51e6';
  shouldShowHeader = true;
  private router = inject(Router);
  constructor(
  ) { }

  ngOnInit() {
    // AOS.init();
    this.router.events.subscribe(() => {
      const currentUrl = this.router.url; // Get the current URL
      this.shouldShowHeader = currentUrl !== '/login'; // Set header visibility based on the URL
    });
    this.isDesktopMode = this.deviceService.isDesktop();
    // console.log('isDesktop: ', this.isDesktopMode);
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isDesktopMode = this.deviceService.isDesktop();

      })
    });

    observer.observe(this.host.nativeElement);

    window.addEventListener('load', (event: any) => {
      // console.log('page refresh');

    });


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
