import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DOMAIN } from 'src/app/util/theme';

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

  constructor() { }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user') || '');
    this.userId = user?.user;
  }

  ngAfterViewInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  handleItemClick(item: { title: string; icon: string; route: string; }) {
    // this.router.navigateByUrl(item?.route);
    if(item.route == 'profiles/view/') item.route = `profiles/view/${this.userId}`;
    
    this.router.navigateForward(item?.route);
  }

  getCurrentYear() {
    return new Date().getFullYear();
  }

}
