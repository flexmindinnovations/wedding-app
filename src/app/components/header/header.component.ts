import { ChangeDetectorRef, Component, effect, ElementRef, HostListener, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faGem, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { NavController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { ProfileStatus } from 'src/app/enums/profile-status';
import { LikedProfilesComponent } from 'src/app/modals/liked-profiles/liked-profiles.component';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EncryptionService } from 'src/app/services/encryption/encryption.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user/user.service';
import { saveData } from 'src/app/store.actions';
import { MENU_ITEMS, tabItems, utils } from 'src/app/util/util';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  router = inject(Router);
  menuItems = MENU_ITEMS;
  tabs = tabItems.displayed;
  loginIcon: IconProp = faGem;
  dialogRef: DynamicDialogRef | undefined;
  registerIcon: IconProp = faUserPlus;
  isLoggedIn: boolean = false;
  profileInterestList: any[] = [];
  favouriteProfiles = [];
  storeData!: Observable<any>;
  notificationItems: any[] = [];
  USER_TABLE = 'userDetails';
  userName: String = "user";
  mobileNo: String = "";
  items: MenuItem[] | undefined;
  authService = inject(AuthService);
  sharedService = inject(SharedService);
  alertService = inject(AlertService);
  showLogoutModal = false;
  isLoginPage: boolean = false;
  isDesktopMode: boolean = false;
  store = inject(Store<{ saveData: any }>);
  dialogService = inject(DialogService);
  navController = inject(NavController);
  deviceService = inject(DeviceDetectorService);
  userService = inject(UserService);
  host = inject(ElementRef);
  encryptionService = inject(EncryptionService);
  public screenWidth: any;
  showSessionExpiredDialog = false;

  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.handlePopState(event);
  }

  constructor(
    private cdr: ChangeDetectorRef
  ) {
    this.onResize();
    effect(() => {
      let isLoggedIn = utils.isLoggedIn();
      if (isLoggedIn) {
        this.isLoggedIn = isLoggedIn;

      } else {
        this.isLoggedIn = this.authService.isLoggedIn();
      }
      this.setUserDetails();
    })
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

    this.sharedService.getRequestStatus().subscribe(isNavigate => {
      if (isNavigate) this.resetActiveClass();
    })

    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isDesktopMode = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);
    if (this.authService.isLoggedIn()) {
      this.sharedService.getFavouriteProfiles().subscribe((favouriteProfiles: any) => {
        if (favouriteProfiles) {
          this.favouriteProfiles = favouriteProfiles;
        }
      });
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

  handlePopState(event: any) {
    setTimeout(() => {
      this.setActivePageOnRefresh();
    });
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

  setActivePageOnRefresh() {
    const currentRoute = this.router.url;
    let activeRoute: any = currentRoute.lastIndexOf('/');
    activeRoute = this.router.url.substring(activeRoute + 1, currentRoute.length);
    if (activeRoute) this.setActivePageByRoute(activeRoute);
    else this.setActivePageById(this.tabs[0].id);
  }

  getUserDetails() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && typeof user === 'object' && Object.keys(user).length > 0) {
      const profileDetails = this.authService.getCustomerProfileById(user?.user);
      const favoriteList = this.userService.getFavouriteProfileList(user?.user);
      const interestList = this.userService.getCustomerInterestList(user?.user);
      const userInterestList = this.userService.getInterest(user?.user);
    }
  }


  logoutUser() {
    this.authService.logoutUser();
    this.showLogoutModal = true;
    utils.isLoggedIn.set(false);
    this.isLoggedIn = false;
    this.router.navigateByUrl('');
  }


  redirectToHome() {
    this.resetActiveClass();
    this.router.navigateByUrl('/');
    this.setActivePageById(this.tabs[0].id);
  }

  resetActiveClass() {
    this.tabs.forEach(item => item.isActive = false);
    this.menuItems.forEach(item => item.isActive = false);
  }


  setActivePageById(pageId: number) {
    // console.log('pageId: ', pageId);
    this.resetActiveClass();
    const selectedItemIndex = this.tabs.findIndex(tab => tab.id === pageId);
    if (selectedItemIndex > -1) this.tabs[selectedItemIndex].isActive = true;
    const desktopItemIndex = this.menuItems.findIndex(tab => tab.id === pageId);
    if (desktopItemIndex > -1) this.menuItems[desktopItemIndex].isActive = true;
    this.cdr.detectChanges();
  }

  handleLogoLoadError(event: any) {
  }

  navigateToPage(item: any) {
    // console.log({ item });
    this.setActivePageById(item.id);
    this.navController.navigateForward('/' + item.route);
    this.isLoginPage = false;
  }

  navigateToLogin() {
    this.navController.navigateForward('login');
    this.isLoginPage = true;
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
  handleNotificationItemClick(item: any) {
    this.resetActiveClass();
    this.router.navigateByUrl(item?.route);
  }

  handleIntrestItemClick(item: any) {
    this.resetActiveClass();
    this.router.navigateByUrl(`profiles/view/${item?.customerId}`);
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
  setUserDetails() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.cdr.detectChanges();
    if (user.mobileNo) {
      const decryptedMobileNo = this.encryptionService.decryptData(user.mobileNo);
      const decryptedUserName = this.encryptionService.decryptData(user.userName);
      this.mobileNo = decryptedMobileNo !== '' ? decryptedMobileNo : '';
      this.userName = decryptedUserName !== '' ? decryptedUserName : 'user';
    }
  }

  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }
  }


  handleSignIn() {
    this.logoutUser();
  }


  ngOnDestroy(): void {
    this.sharedService.isLoggedInCompleted.unsubscribe();
    this.sharedService.isLoggedOutCompleted.unsubscribe();
  }
}

