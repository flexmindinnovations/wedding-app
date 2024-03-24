import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MENU_ITEMS, tabItems } from 'src/app/util/util';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.page.html',
  styleUrls: ['./layout.page.scss'],
})
export class LayoutPage implements OnInit {
  tabs = tabItems.displayed;
  router = inject(Router);
  navController = inject(NavController);
  cdr = inject(ChangeDetectorRef);
  deviceService = inject(DeviceDetectorService);
  host = inject(ElementRef);
  ngZone = inject(NgZone);
  isDesktopMode: boolean = false;

  menuItems = MENU_ITEMS;
  loginIcon: IconProp = faGem;
  isLoginPage: boolean = false;

  ngOnInit() {
    this.setActivePageOnRefresh();
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isDesktopMode = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);
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

}
