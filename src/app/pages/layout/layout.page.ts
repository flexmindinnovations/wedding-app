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
import { Observable, delay, forkJoin, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { saveData } from 'src/app/store.actions';
import { ProfileStatus } from 'src/app/enums/profile-status';
import * as AOS from 'aos';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';
import { UserService } from 'src/app/services/user/user.service';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';

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
  alertService = inject(AlertService);
  userService = inject(UserService);
  host = inject(ElementRef);
  ngZone = inject(NgZone);
  isDesktopMode: boolean = false;
  showLogoutModal = false;
  showSessionExpiredDialog = false;
  dialogRef: DynamicDialogRef | undefined;
  menuItems = MENU_ITEMS;
  loginIcon: IconProp = faGem;
  registerIcon: IconProp = faGem;
  isLoginPage: boolean = false;
  isLoggedIn: boolean = false;

  store = inject(Store<{ saveData: any }>);
  storeData!: Observable<any>;
  notificationItems: any[] = [];
  favoriteProfiles = [];
  dialogService=inject(DialogService);

  profileItems: MenuItem[] = [
    {
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-user',
          command: () => {
            this.router.navigateByUrl('profile/personal');
          }
        },
        {
          label: 'Manage Favorite Profiles',
          icon: 'pi pi-heart',
          command: () => {
            // this.router.navigateByUrl('profile/personal');
          }
        },
        {
          separator: true
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          styleClass: 'logout',
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
    window.onload = (event: any) => {
      AOS.refresh();
      if (this.authService.isLoggedIn()) this.getUserDetails();
    }

    this.sharedService.isUnAuthorizedRequest.subscribe((isUnAuthorizedRequest: any) => {
      if (isUnAuthorizedRequest) {
        this.showSessionExpiredDialog = true;
        this.cdr.detectChanges();
      }
    })

    this.sharedService.isUserDetailUpdated.subscribe((isUserUpdated: any) => {
      if (isUserUpdated && this.authService.isLoggedIn()) this.getUserDetails();
    })
  }

  handleSignIn() {
    this.logoutUser();
  }

  getUserDetails() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profileDetails = this.authService.getCustomerProfileById(user?.user);
    const favoriteList = this.userService.getFavouriteProfileList(user?.user);

    forkJoin({ profileDetails, favoriteList }).subscribe({
      next: (response) => {
        if (response) {
          const { profileDetails, favoriteList } = response;
          if (profileDetails) {
            this.setProfileDetails(profileDetails);
          }
          if (favoriteList?.length) this.favoriteProfiles = favoriteList;
        }
      },
      error: (error) => {

      }
    })

    this.authService.getCustomerProfileById(user?.user).subscribe({
      next: (response) => {
        if (response) {

        }
      },
      error: (error: any) => {
        const err = error?.error;
        const errorMessage = err.message ? err?.message : 'Something went wrong';
      }
    })
  }

  setProfileDetails(response: any) {
    const profileStatusParams = ['isFamilyInfoFill', 'isImagesAdded', 'isOtherInfoFill', 'isPersonInfoFill', 'isContactInfoFill'];
    const { isFamilyInfoFill, isImagesAdded, isOtherInfoFill, isPersonInfoFill, isContactInfoFill, profileStatus } = response;
    this.store.dispatch(saveData({ profileStatusData: { isFamilyInfoFill, isImagesAdded, isOtherInfoFill, isPersonInfoFill, isContactInfoFill } }))
    this.notificationItems = [];
    if (profileStatus === ProfileStatus.incomplete) {
      this.resetActiveClass();
      this.notificationItems.push({
        key: 'profileStatus',
        text: 'Profile is incomplete',
        icon: 'pi pi-times',
        route: 'profile/personal'
      });
    }
    Object.keys(response).forEach((key) => {
      const obj = {
        key: key,
        text: '',
        icon: '',
        route: ''
      }
      if (profileStatusParams.includes(key) && response[key] === false) {
        switch (key) {
          case profileStatusParams[0]:
            obj.key = key;
            obj.text = 'Family details are not updated.';
            obj.icon = 'pi pi-users';
            obj.route = 'profile/family';
            this.notificationItems.push(obj);
            break;
          case profileStatusParams[1]:
            obj.key = key;
            obj.text = 'Profile Images are not uploaded.';
            obj.icon = 'pi pi-images';
            obj.route = 'profile/photos';
            this.notificationItems.push(obj);
            break;
          case profileStatusParams[2]:
            obj.key = key;
            obj.text = 'Other required details are not updated.';
            obj.icon = 'pi pi-info-circle';
            obj.route = 'profile/other';
            this.notificationItems.push(obj);
            break;
          case profileStatusParams[3]:
            obj.key = key;
            obj.text = 'Personal details are not updated.';
            obj.icon = 'pi pi-user';
            obj.route = 'profile/personal';
            this.notificationItems.push(obj);
            break;
          case profileStatusParams[4]:
            obj.key = key;
            obj.text = 'Contact details are not updated.';
            obj.icon = 'pi pi-mobile';
            obj.route = 'profile/contact';
            this.notificationItems.push(obj);
            break;
        }
      }
    })

  }

  ngAfterViewInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.sharedService.getRequestStatus().subscribe(isNavigate => {
      if (isNavigate) this.resetActiveClass();
    })

    this.sharedService.isLoggedInCompleted.subscribe(() => {
      this.router.navigateByUrl('profile/personal');
    })
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
    // console.log('event: ', event);

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

  handleNotificationItemClick(item: any) {
    // console.log('item: ', item);
    this.router.navigateByUrl(item?.route);
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
      // console.log('afterClose: ', afterClose);
      if (afterClose) { }
    });
  }
}
