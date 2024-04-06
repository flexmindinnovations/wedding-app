import { Component, ElementRef, HostListener, NgZone, OnInit, inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AnimationDirection } from 'src/app/components/carousel-item/carousel-item.component';
import { HomeService } from 'src/app/services/home/home.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  deviceService = inject(DeviceDetectorService);
  host = inject(ElementRef);
  ngZone = inject(NgZone);
  isMobile: boolean = false;
  isDesktop: boolean = true;
  profileList: any[] = [];
  imagePathPart = environment.endpoint;
  homeService = inject(HomeService);
  currentItem = 0;
  carouselButtonStyle = `absolute top-48 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-wr-600 hover:text-wr-400 focus:text-wr-400 -ml-6 focus:outline-none focus:shadow-outline disabled:bg-gray-100 disabled:text-gray-200 disabled:shadow-none disabled:cursor-not-allowed`;

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    this.handleOnScroll(event);
  };

  animateDirection: AnimationDirection = 'right';
  constructor() { }

  ngOnInit() {
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isMobile = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);

    this.getRandomProfiles();
  }

  handleOnScroll(event: any) {
    console.log('event scroll: ', event);

  }

  getRandomProfiles() {
    this.homeService.getRandomProfiles().subscribe({
      next: (response: any) => {
        if (response) {
          // console.log('response: ', response[0]);
          const data = response.map((item: any) => {
            item['isDisplayed'] = false;
            return item;
          });
          data[0].isDisplayed = true;
          this.profileList = data;
        }
      },
      error: (error: any) => {

      }
    })
  }

  handleItemClick(src: string) {
    switch (src) {
      case 'next':
        const next = this.currentItem + 1;
        this.currentItem = next === this.profileList.length ? 0 : next;
        this.animateDirection = 'right';
        break;
      case 'prev':
        const prev = this.currentItem - 1;
        this.currentItem = prev < 0 ? this.profileList.length - 1 : prev;
        this.animateDirection = 'left';
        break;
    }
    this.profileList.forEach((item) => {
      item.isDisplayed = false;
    })
    this.profileList[this.currentItem].isDisplayed = true;
  }

}
