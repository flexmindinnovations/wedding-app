import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.page.html',
  styleUrls: ['./privacy-policy.page.scss'],
})
export class PrivacyPolicyPage implements OnInit {
  deviceService = inject(DeviceDetectorService);
  isMobile: boolean = false;
  isDesktop: boolean = true;
  host = inject(ElementRef);

  fileUrl = 'https://docs.google.com/document/d/1Ay6lwN0L8i5uAVp1jlpgWfQ1dFbdexbV/preview';

  constructor() { }
  ngOnInit(): void {
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isMobile = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);
  }

}
