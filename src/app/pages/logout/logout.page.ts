import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { delay, of } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit, AfterViewInit {

  constructor(
    private router: Router,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    of(true)
      .pipe(
        delay(2000)
      ).subscribe(() => {
        this.logoutUser();
      })
  }

  logoutUser() {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/');
    this.sharedService.isLoggedOutCompleted.next(true);
  }

}
