import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  deviceService = inject(DeviceDetectorService);
  isMobile: boolean = false;
  isDesktop: boolean = true;
  host = inject(ElementRef);
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
