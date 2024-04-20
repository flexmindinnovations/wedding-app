import { Component, ElementRef, HostListener, NgZone, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable, Observer, share } from 'rxjs';
import { AnimationDirection } from 'src/app/components/carousel-item/carousel-item.component';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { HomeService } from 'src/app/services/home/home.service';
import { SharedService } from 'src/app/services/shared.service';
import { DOMAIN } from 'src/app/util/theme';
import { environment } from 'src/environments/environment';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from 'src/app/services/auth/auth.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  deviceService = inject(DeviceDetectorService);
  host = inject(ElementRef);
  router = inject(Router);
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
  id = uuidv4();
  sharedService = inject(SharedService);
  authService = inject(AuthService);
  public screenWidth: any;
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

  showLaunchOfferBanner = false;
  showOfferMarqueue = false;
  showQRPopup = false;
  dialogRef: DynamicDialogRef | undefined;


  alert = inject(AlertService);
  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    this.handleOnScroll(event);
  };

  animateDirection: AnimationDirection = 'right';
  constructor(private dialogService: DialogService,) {
    this.observable = new Observable<boolean>((observer: any) => this.observer = observer).pipe(share());
    setTimeout(() => this.observer?.next(true), 2000);
    this.onResize();
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
  ngAfterViewInit(): void {
    const currentDate = moment('Fri Apr 19 2024 16:17:26 GMT+0530');
    const futurDate = moment(currentDate).add(2, 'days');
    if (futurDate.diff(currentDate, 'days') > 0) {
      this.showLaunchOfferBanner = true;
    }
  }

  handleOnLoadData(event: any) {
    this.isVideoLoaded = true;
    let videoPlayer = <HTMLVideoElement>document.getElementById('videoPlayer');
    videoPlayer.play();
  }

  handleOnScroll(event: any) {
    // console.log('event scroll: ', event);

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

  handleExploreProfiles() {
    this.router.navigate(['/filter-profile']);
  }

  handleRegister() {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.showQRPopup = true;
    } else {
      this.dialogRef = this.dialogService.open(RegisterUserComponent, {
        header: 'Sign up',
        width: '25%',
        baseZIndex: 10000,
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
        },
        maximizable: false
      })
      this.sharedService.setRequestStatus(true);
    }
  }
  closeOfferDialog() {
    this.showOfferMarqueue = true;
    this.showLaunchOfferBanner = false;
    this.showQRPopup = false;

  }

  handleCompletePayment() {
    this.closeOfferDialog();
    this.showQRPopup = true;
  }
  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '25vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }

  }
}
