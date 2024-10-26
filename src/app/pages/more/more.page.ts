import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DOMAIN } from 'src/app/util/theme';
import { title } from 'process';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LikedProfilesComponent } from 'src/app/modals/liked-profiles/liked-profiles.component';
import { SharedService } from 'src/app/services/shared.service';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';
import { CustomerRegistrationService } from 'src/app/services/customer-registration.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AlertType } from 'src/app/enums/alert-types';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit, AfterViewInit {
  loginIcon: IconProp = faRightFromBracket;
  domain = DOMAIN;
  router = inject(NavController);
  authService = inject(AuthService);
  isLoggedIn: boolean = false;
  userId: any;
  userName: any;
  mobileNo: any;
  dialogService = inject(DialogService);
  dialogRef: DynamicDialogRef | undefined;
  isDesktopMode: boolean = false;
  favouriteProfiles = [];
  customerRegistrationService = inject(CustomerRegistrationService);


  listItems = [
    // {
    //   title: 'About',
    //   icon: 'information-circle-outline',
    //   route: '/about'
    // },
    {
      title: 'Contact Us',
      icon: 'mail-outline',
      route: '/contact'
    }
  ]

  constructor(
    private sharedService: SharedService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user?.user;
    this.addHamburgerToDialogHeader();
    this.getUserDetails();
  }

  getUserDetails() {
    this.customerRegistrationService.getCustomerDetailsById(this.userId).subscribe({
      next: (data: any) => {
        if (data) {
          this.mobileNo = data?.customerUserName;
          const info = data?.personalInfoModel;
          this.userName = `${info?.firstName} ${info?.lastName}`;
        }
      },
      error: (error) => {
        console.log('error: ', error);
        this.alertService.setAlertMessage('Error: ' + error, AlertType.error);
      }
    })
  }

  ngAfterViewInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  handleItemClick(item: { title: string; icon: string; route: string; }) {
    // this.router.navigateByUrl(item?.route);
    if (item.route) {
      if (item.route == 'profiles/view/') item.route = `profiles / view / ${this.userId} `;

      this.router.navigateForward(item?.route);
    } else {
      if (item?.title === 'Manage Favorite Profile') {
        this.OpenLikedProfileModal();
      }
      if (item?.title === 'Register') {
        this.handleRegister();
      }
    }

  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

  OpenLikedProfileModal() {
    this.dialogRef = this.dialogService.open(LikedProfilesComponent, {
      header: 'Manage Favourite Profiles',
      styleClass: 'liked-profiles-modal',
      closable: true,
      width: '100%',
      height: '100%',
      style: { 'max-height': '100%' },
      maximizable: false,
      baseZIndex: 10000,
      data: this.favouriteProfiles,
    })

    setTimeout(() => {
      this.addHamburgerToDialogHeader();
    }, 300)
    this.dialogRef.onClose.subscribe((afterClose: any) => {
      if (afterClose) { }
    });
  }

  addHamburgerToDialogHeader() {
    const modalHederTitleEl = document.getElementsByClassName('p-dialog-title')[0];
    if (modalHederTitleEl) {
      modalHederTitleEl.classList.add('hamburgerButtonStyle')
      const hamburgerButton = document.createElement('button');
      hamburgerButton.type = 'button';
      hamburgerButton.classList.add('pButton');
      hamburgerButton.classList.add('pRipple');
      hamburgerButton.classList.add('p-dialog-header-icon');
      hamburgerButton.innerHTML = '<i class="pi pi-bars"></i>';
      hamburgerButton.title = 'Toggle Menu';
      hamburgerButton.addEventListener('click', () => {
        this.sharedService.isSidebarOpen.update(val => !val);
      });
      modalHederTitleEl.insertBefore(hamburgerButton, modalHederTitleEl.firstChild);
    }
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

}
