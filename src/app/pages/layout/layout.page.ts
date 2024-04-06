import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MENU_ITEMS, tabItems } from 'src/app/util/util';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NavController } from '@ionic/angular';
import { HostListener } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { delay, of } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit, AfterViewInit, OnDestroy {
  tabs = tabItems.displayed;
  router = inject(Router);
  navController = inject(NavController);
  cdr = inject(ChangeDetectorRef);
  deviceService = inject(DeviceDetectorService);
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  host = inject(ElementRef);
  ngZone = inject(NgZone);
  isDesktopMode: boolean = false;
  showLogoutModal = false;

  menuItems = MENU_ITEMS;
  loginIcon: IconProp = faGem;
  isLoginPage: boolean = false;
  isLoggedIn: boolean = false;
  profileItems = [
    {
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-user',
          command: () => {
            this.router.navigateByUrl('profile');
          }
        },
        {
          separator: true
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => {
            this.logoutUser();
          }
        }
      ]
    }
  ];

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.handlePopState(event);
  }

  ngOnInit() {
    this.setActivePageOnRefresh();
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isDesktopMode = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);

    this.sharedService.getIsLoggedInEvent().subscribe((completed: any) => {
      if (completed) {
        setTimeout(() => {
          window.location.reload();
        })
      }
    })
    this.sharedService.getIsLoggedOutEvent().subscribe((completed: any) => {
      if (completed) {
        setTimeout(() => {
          window.location.reload();
        })
      }
    })
  }

  ngAfterViewInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  setActivePageOnRefresh() {
    const currentRoute = this.router.url;
    let activeRoute: any = currentRoute.lastIndexOf('/');
    activeRoute = this.router.url.substring(activeRoute + 1, currentRoute.length);
    if (activeRoute !== 'app') this.setActivePageByRoute(activeRoute);
    else {
      this.resetActiveClass();
      this.setActivePageById(this.tabs[0].id);
    }
  }

  handlePopState(event: any) {
    setTimeout(() => {
      this.setActivePageOnRefresh();
    });
  }

  navigateToPage(item: any) {
    this.setActivePageById(item.id);
    this.navController.navigateForward(item.route);
    this.isLoginPage = false;
  }

  setActivePageByRoute(param: string) {
    this.resetActiveClass();
    const selectedItemIndex = this.tabs.findIndex(tab => tab.route === param);
    if (selectedItemIndex > -1) this.tabs[selectedItemIndex].isActive = true;
    const desktopItemIndex = this.menuItems.findIndex(tab => tab.route === param);
    if (desktopItemIndex > -1) this.menuItems[desktopItemIndex].isActive = true;
    this.cdr.detectChanges();
  }

  navigateToLogin() {
    this.navController.navigateForward('login');
    this.isLoginPage = true;
  }

  setActivePageById(pageId: number) {
    this.resetActiveClass();
    const selectedItemIndex = this.tabs.findIndex(tab => tab.id === pageId);
    if (selectedItemIndex > -1) this.tabs[selectedItemIndex].isActive = true;
    const desktopItemIndex = this.menuItems.findIndex(tab => tab.id === pageId);
    if (desktopItemIndex > -1) this.menuItems[desktopItemIndex].isActive = true;
    this.cdr.detectChanges();
  }

  redirectToHome() {
    this.resetActiveClass();
    this.router.navigateByUrl('/');
  }

  handleLogoLoadError(event: any) {
    console.log('event: ', event);

  }

  resetActiveClass() {
    this.tabs.forEach(item => item.isActive = false);
    this.menuItems.forEach(item => item.isActive = false);
  }

  logoutUser() {
    this.authService.logoutUser();
    this.showLogoutModal = true;
    setTimeout(() => {
      this.router.navigateByUrl('/');
      this.sharedService.isLoggedOutCompleted.next(true);
    })
  }

  ngOnDestroy(): void {
    this.sharedService.isLoggedInCompleted.unsubscribe();
    this.sharedService.isLoggedOutCompleted.unsubscribe();
  }

}
