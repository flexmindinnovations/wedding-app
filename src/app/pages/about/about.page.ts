import { Component, ElementRef, NgZone, OnInit, inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOMAIN } from 'src/app/util/theme';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  deviceService = inject(DeviceDetectorService);
  host = inject(ElementRef);
  ngZone = inject(NgZone);
  
  isMobile: boolean = false;
  isDesktop: boolean = true;

  domain = DOMAIN;
  constructor() { }

  ngOnInit() {
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isMobile = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);

  }

}
