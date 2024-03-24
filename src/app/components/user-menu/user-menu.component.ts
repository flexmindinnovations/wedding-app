import { AfterContentInit, Component, OnInit, inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Dropdown } from 'flowbite';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent implements OnInit, AfterContentInit {
  iconSrc = '/assets/icon/user.png';
  router = inject(Router);
  profileInfo: any = {};
  isOpen = false;
  menuId: any = uuidv4();
  buttonId = uuidv4();
  dropdown: any;

  dropdownOptions: any = {
    placement: 'bottom',
    triggerType: 'click',
    offsetSkidding: 0,
    offsetDistance: 10,
    delay: 300,
    ignoreClickOutsideClass: false,
    onHide: () => { this.isOpen = false; },
    onShow: () => { },
    onToggle: () => { },
  }

  constructor() { }

  ngOnInit() { }

  ngAfterContentInit(): void {
    const profile = JSON.parse(localStorage.getItem('profile') || '{}');
    this.profileInfo = profile ? profile : {};
  }

  handleImageLoadError(event: ErrorEvent) {
  }

  openUserMenu() {
    const targetEl = document.getElementById(this.menuId);
    const triggerEl = document.getElementById(this.buttonId);
    const instanceOptions = {
      id: this.menuId,
      override: false
    };
    this.dropdown = new Dropdown(targetEl, triggerEl, this.dropdownOptions, instanceOptions);
    if (this.isOpen) this.dropdown.hide();
    else this.dropdown.show();
    this.isOpen = !this.isOpen;
  }

  handleUserSignOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('profile');
    this.router.navigateByUrl('login');
  }
}
