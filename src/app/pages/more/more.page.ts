import { Component, OnInit, inject } from '@angular/core';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-more',
  templateUrl: './more.page.html',
  styleUrls: ['./more.page.scss'],
})
export class MorePage implements OnInit {
  loginIcon: IconProp = faRightFromBracket;
  router = inject(NavController);
  listItems = [
    {
      title: 'About',
      icon: 'information-circle-outline',
      route: '/about'
    },
    {
      title: 'Contact Us',
      icon: 'mail-outline',
      route: '/contact'
    },
    {
      title: 'Login',
      icon: 'log-in-outline',
      route: 'login'
    }
  ]

  constructor() { }

  ngOnInit() {
  }

  handleItemClick(item: { title: string; icon: string; route: string; }) {
    // this.router.navigateByUrl(item?.route);
    this.router.navigateForward(item?.route);
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

}
