import { Component, ElementRef, HostListener, NgZone, OnInit, inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, Observer, share } from 'rxjs';
import { AnimationDirection } from 'src/app/components/carousel-item/carousel-item.component';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HomeService } from 'src/app/services/home/home.service';
import { DOMAIN } from 'src/app/util/theme';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
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

  domain = DOMAIN;
  isVideoLoaded = false;

  profileCount = 100;
  branchCount = 10;
  public observable: Observable<boolean>;
  private observer!: Observer<boolean>;
  public config = {
    animation: 'count',
    format: ',ddd',
    value: 0,
    auto: true,
  }

  alert = inject(AlertService);
  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    this.handleOnScroll(event);
  };

  animateDirection: AnimationDirection = 'right';
  constructor() {
    this.observable = new Observable<boolean>((observer: any) => this.observer = observer).pipe(share());
    setTimeout(() => this.observer?.next(true), 2000);
  }

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

  handleOnLoadData(event: any) {
    this.isVideoLoaded = true;
    let videoPlayer = <HTMLVideoElement>document.getElementById('videoPlayer');
    videoPlayer.play();
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
