import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home-page-wrapper',
  templateUrl: './home-page-wrapper.component.html',
  styleUrls: ['./home-page-wrapper.component.scss'],
})
export class HomePageWrapperComponent implements OnInit {

  isLoggedIn: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    console.log('isLoggedIn HomePageWrapperComponent: ', this.isLoggedIn);
    if (this.isLoggedIn) {
      this.router.navigateByUrl('/app');
    } else {
      this.router.navigateByUrl('');
    }
  }

}
