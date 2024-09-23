import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MENU_ITEMS, tabItems, utils } from 'src/app/util/util';
import { faGem, faUserPlus } from '@fortawesome/free-solid-svg-icons';
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
import { environment } from 'src/environments/environment';
import { LikedProfilesComponent } from 'src/app/modals/liked-profiles/liked-profiles.component';
import { DOMAIN } from 'src/app/util/theme';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit, AfterViewInit, OnDestroy {
  tabs = tabItems.displayed;
  isDesktopMode: boolean = false;
  showLogoutModal = false;
  showSessionExpiredDialog = false;
  dialogRef: DynamicDialogRef | undefined;
  menuItems = MENU_ITEMS;
  loginIcon: IconProp = faGem;
  registerIcon: IconProp = faUserPlus;
  public screenWidth: any;
  storeData!: Observable<any>;
  notificationItems: any[] = [];
  profileInterestList: any[] = [];
  favouriteProfiles = [];
  USER_TABLE = 'userDetails';

  isLoginPage: boolean = false;
  isLoggedIn: boolean = false;

  store = inject(Store<{ saveData: any }>);
  dialogService = inject(DialogService);
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
  userName: String = "user";
  mobileNo: String = "";
  customerRegistrationService = inject(CustomerRegistrationService);
  items: MenuItem[] | undefined;
  constructor(
  ) {
    this.onResize();
    effect(() => {
      let isLoggedIn = utils.isLoggedIn();
      if (isLoggedIn) {
        this.isLoggedIn = isLoggedIn;
      } else {
        this.isLoggedIn = this.authService.isLoggedIn();
      }
    })
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.handlePopState(event);
  }

  handleNonClickableItemClick(event: any) {
    // event.preventDefault()
    event.stopImmediatePropagation();
  }

  ngOnInit() {
    this.items = [
      {
        separator: true
      },
      {
        items: [
          {
            label: 'Profile',
            icon: 'pi pi-user',
            command: () => {
              this.router.navigateByUrl('profile/personal');
              this.resetActiveClass();
            }
          },
          {
            label: 'Public Profile',
            icon: 'pi pi-link',
            command: () => {
              const user = JSON.parse(localStorage.getItem('user') || '');
              if (user) {
                this.router.navigateByUrl(`profiles/view/${user?.user}`);
                this.resetActiveClass();
              }
            }
          },
          {
            label: 'Manage Favorite Profiles',
            icon: 'pi pi-heart',
            command: () => {
              this.OpenLikedProfileModal();
            }
          },
          {
            label: 'Profile History',
            icon: 'pi pi-history',
            command: () => {
              this.router.navigateByUrl('profile-history');
              this.resetActiveClass();
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
              this.resetActiveClass();
            }
          }
        ]
      },
    ];

    this.setActivePageOnRefresh();
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isDesktopMode = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);

    this.sharedService.getFavouriteProfiles().subscribe((favouriteProfiles: any) => {
      if (favouriteProfiles) {
        this.favouriteProfiles = favouriteProfiles;
      }
    });

    window.onload = (event: any) => {
      // AOS.refresh();
      // if (this.authService.isLoggedIn()) this.getUserDetails();
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

    this.sharedService.footerItemClickEvent.subscribe((event: any) => {
      this.setActivePageByRoute(event);
    })
  }

  handleSignIn() {
    this.logoutUser();
  }

  getUserDetails() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && typeof user === 'object' && Object.keys(user).length > 0) {
      const profileDetails = this.authService.getCustomerProfileById(user?.user);
      const favoriteList = this.userService.getFavouriteProfileList(user?.user);
      const interestList = this.userService.getCustomerInterestList(user?.user);
      // when user clicks on thumb button this api will call
      const userInterestList = this.userService.getInterest(user?.user);

      // forkJoin({ profileDetails, favoriteList, interestList,userInterestList }).subscribe({
      //   next: (response) => {
      //     if (response) {
      //       const { profileDetails, favoriteList, interestList,userInterestList } = response;
      //       if (profileDetails) this.setProfileDetails(profileDetails);
      //       if (favoriteList?.length) this.sharedService.setFavouriteProfiles.next(favoriteList);
      //       if (interestList?.length) this.profileInterestList = utils.setProfileInterestList(interestList);
      //       if (userInterestList?.length) utils.profileIntrestList.set(userInterestList);
      //     }
      //   },
      //   error: (error) => {
      //     this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error)
      //   }
      // })
    }
  }

  getCustomerDetails() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.customerRegistrationService.getCustomerDetailsById(user?.user).subscribe({
      next: (data: any) => {
        if (data) {
          utils.userDetails.set(data);
          this.mobileNo = data?.customerUserName;
          const info = data?.personalInfoModel;
          this.userName = `${info?.firstName} ${info?.lastName}`;
          this.router.navigateByUrl('app');
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }

  setProfileDetails(response: any) {
    const profileStatusParams = ['isFamilyInfoFill', 'isImagesAdded', 'isOtherInfoFill', 'isPersonInfoFill', 'isContactInfoFill'];
    const { isFamilyInfoFill, isImagesAdded, isOtherInfoFill, isPersonInfoFill, isContactInfoFill, profileStatus } = response;
    this.store.dispatch(saveData({ profileStatusData: { isFamilyInfoFill, isImagesAdded, isOtherInfoFill, isPersonInfoFill, isContactInfoFill } }))
    this.notificationItems = [];
    if (profileStatus === ProfileStatus.incomplete) {
      // this.resetActiveClass();
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
    if (this.isLoggedIn) {
      this.getCustomerDetails();
    } else {
      this.router.navigateByUrl('');
    }
    this.sharedService.getRequestStatus().subscribe(isNavigate => {
      if (isNavigate) this.resetActiveClass();
    })
  }

  setActivePageOnRefresh() {
    const currentRoute = this.router.url;
    let activeRoute: any = currentRoute.lastIndexOf('/');
    activeRoute = this.router.url.substring(activeRoute + 1, currentRoute.length);
    if (activeRoute) this.setActivePageByRoute(activeRoute);
    else this.setActivePageById(this.tabs[0].id);
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
    if (this.deviceService.isMobile()) {
      const selectedItemIndex = this.tabs.findIndex(tab => tab.route === param);
      if (selectedItemIndex > -1) this.tabs[selectedItemIndex].isActive = true;
    } else {
      const desktopItemIndex = this.menuItems.findIndex(tab => tab.route === param);
      if (desktopItemIndex > -1) this.menuItems[desktopItemIndex].isActive = true;
    }
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
    this.setActivePageById(this.tabs[0].id);
  }

  handleLogoLoadError(event: any) {
  }

  resetActiveClass() {
    this.tabs.forEach(item => item.isActive = false);
    this.menuItems.forEach(item => item.isActive = false);
  }

  logoutUser() {
    this.authService.logoutUser();
    this.showLogoutModal = true;
    utils.isLoggedIn.set(false);
    this.isLoggedIn = false;
    this.router.navigateByUrl('');
  }

  ngOnDestroy(): void {
    this.sharedService.isLoggedInCompleted.unsubscribe();
    this.sharedService.isLoggedOutCompleted.unsubscribe();
  }

  handleNotificationItemClick(item: any) {
    this.resetActiveClass();
    this.router.navigateByUrl(item?.route);
  }

  handleIntrestItemClick(item: any) {
    this.resetActiveClass();
    this.router.navigateByUrl(`profiles/view/${item?.customerId}`);
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
      if (afterClose) { }
    });
  }

  OpenLikedProfileModal() {
    this.dialogRef = this.dialogService.open(LikedProfilesComponent, {
      header: 'Manage Favourite Profiles',
      styleClass: 'liked-profiles-modal',
      closable: true,
      width: this.isDesktopMode ? '80%' : '90%',
      height: this.isDesktopMode ? '70%' : '80%',
      maximizable: true,
      baseZIndex: 10000,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      data: this.favouriteProfiles,
    })

    this.dialogRef.onClose.subscribe((afterClose: any) => {
      if (afterClose) { }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }
  }

}
