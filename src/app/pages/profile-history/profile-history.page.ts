import { Component, OnInit } from '@angular/core';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile-history',
  templateUrl: './profile-history.page.html',
  styleUrls: ['./profile-history.page.scss'],
})
export class ProfileHistoryPage implements OnInit {

  profileHistory: any;
  isLoading = false;
  endpoint = environment.endpoint;
  constructor( private sharedService: SharedService,  private alertService: AlertService) { }

  ngOnInit() {
    this.getProfileHistory();
  }

  
  getProfileHistory(){
    this.isLoading = true;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.sharedService.getProfileViewHistory(user.user).subscribe({
      next: (response: any) => {
        if (response) {
          this.profileHistory = response;
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error)
      }
    });
  }
}
