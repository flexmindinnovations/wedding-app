import { Component, ElementRef, HostListener, NgZone, OnInit, inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable, Observer, share } from 'rxjs';
import { AnimationDirection } from 'src/app/components/carousel-item/carousel-item.component';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';
import { HomeService } from 'src/app/services/home/home.service';
import { DOMAIN } from 'src/app/util/theme';
import { environment } from 'src/environments/environment';
import { NgParticlesService } from "@tsparticles/angular";
import { particlesOptions } from 'src/app/util/util';
import { v4 as uuidv4 } from 'uuid';
import { Container } from '@tsparticles/engine';
import { loadSlim } from "@tsparticles/slim";

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

  domain = DOMAIN;
  particlesOptions: any = particlesOptions;
  particleId: any = uuidv4();

  videoPlayerOptions = { autoplay: true, controls: false, sources: [{ src: '/assets/videos/intro.mp4', type: 'video/mp4' }] }

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

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    this.handleOnScroll(event);
  };

  animateDirection: AnimationDirection = 'right';
  dialogRef: DynamicDialogRef | undefined;
  constructor(
    private dialogService: DialogService,
    private readonly ngParticlesService: NgParticlesService
  ) {
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

    this.ngParticlesService.init(async (engine) => {
      console.log(engine);

      // Starting from 1.19.0 you can add custom presets or shape here, using the current tsParticles instance (main)
      // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
      // starting from v2 you can add only the features you need reducing the bundle size
      //await loadFull(engine);
      await loadSlim(engine);
    });
  }

  handleOnScroll(event: any) {
    console.log('event scroll: ', event);

  }

  particlesLoaded(container: Container): void {
    console.log(container);
  }

  handleRegister() {
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

    this.dialogRef.onClose.subscribe((afterClose: any) => {
      console.log('afterClose: ', afterClose);
      if (afterClose) { }
    });
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
