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
// import * as AOS from 'aos';
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
import { EncryptionService } from 'src/app/services/encryption/encryption.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit, AfterViewInit {
  tabs = tabItems.displayed;
  isDesktopMode: boolean = false;
  showSessionExpiredDialog = false;
  public screenWidth: any;

  cdr = inject(ChangeDetectorRef);
  deviceService = inject(DeviceDetectorService);
  userService = inject(UserService);
  host = inject(ElementRef);
  ngZone = inject(NgZone);
  navController = inject(NavController);
  customerRegistrationService = inject(CustomerRegistrationService);
  isLoginPage: boolean = false;
  menuItems = MENU_ITEMS;


  constructor(
  ) {
    this.onResize();
  }

  handleNonClickableItemClick(event: any) {
    // event.preventDefault()
    event.stopImmediatePropagation();
  }

  ngOnInit() {
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isDesktopMode = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);
  }


  ngAfterViewInit(): void {


  }


  @HostListener('window:resize', ['$event'])
  onResize(event?: any) {
    this.screenWidth = window.innerWidth;
  }

  navigateToPage(item: any) {
    this.setActivePageById(item.id);
    this.navController.navigateForward(item.route);
    this.isLoginPage = false;
  }

  setActivePageById(pageId: number) {
    console.log('pageId: ', pageId);

    this.resetActiveClass();
    const selectedItemIndex = this.tabs.findIndex(tab => tab.id === pageId);
    if (selectedItemIndex > -1) this.tabs[selectedItemIndex].isActive = true;
    const desktopItemIndex = this.menuItems.findIndex(tab => tab.id === pageId);
    if (desktopItemIndex > -1) this.menuItems[desktopItemIndex].isActive = true;
    this.cdr.detectChanges();
  }

  resetActiveClass() {
    this.tabs.forEach(item => item.isActive = false);
    this.menuItems.forEach(item => item.isActive = false);
  }

  getDialogStyle() {
    if (this.screenWidth < 640) {  // Example breakpoint for small devices
      return { width: '90vw', padding: '0' }; // Use 90% of screen width on small devices
    } else {
      return { width: '30vw', padding: '0' }; // Default to 25% of screen width on larger screens
    }
  }

}
