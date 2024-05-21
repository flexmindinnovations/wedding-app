import { animate, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { fadeIn, fadeOut, scaleIn, scaleOut, slideLeft, slideRight } from 'src/app/animations/carousel.animation';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { environment } from 'src/environments/environment';
import { DataExportComponent } from '../data-export/data-export.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'carousel-item',
  templateUrl: './carousel-item.component.html',
  styleUrls: ['./carousel-item.component.scss'],
  animations: [
    trigger('carouselAnimation', [
      transition('* => *', [useAnimation(fadeIn, { params: { time: '900ms' } })]),
      transition('* => *', [useAnimation(fadeOut, { params: { time: '900ms' } })])
    ])
  ]
})
export class CarouselItemComponent implements OnInit {

  @Input() isDisplayed: boolean = false;
  @Input() data: any;
  isFavourite: boolean = false;
  imagePath: any = '';
  showLoginDialog = false;
  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    public dialogService: DialogService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    const networkImage = `${this.data.imagePath1 ? this.data.imagePath1 : this.data.imagePath2 ? this.data.imagePath2 : ''}`;
    this.imagePath = networkImage ? `${environment.endpoint}/${networkImage}` : '/assets/image/image-placeholder.png';
  }

  handleIsFavourite() {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      this.isFavourite = !this.isFavourite;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const payload = {
        customerLikeId: 0,
        likerId: user?.user,
        likedId: this.data?.customerId,
        isLike: this.isFavourite
      };
      this.userService.setFavourite(payload).subscribe({
        next: (response: any) => {
          if (response) {
            this.alertService.setAlertMessage(response?.message, AlertType.success);
            this.getUpdatedFavouriteProfileList(user?.user);
          }
        },
        error: (error: any) => {
          this.alertService.setAlertMessage('Failed to add profile to favourites', AlertType.error);
        }
      })
    } else {
      const { customerId } = this.data;
      sessionStorage.setItem('inquiry', customerId);
      this.showLoginDialog = true;
    }
  }

  getUpdatedFavouriteProfileList(userId: any) {
    this.userService.getFavouriteProfileList(userId).subscribe({
      next: (response) => {
        if (response) {
          const profileList = response;
          this.sharedService.setFavouriteProfiles.next(profileList);
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error)
      }
    });
  }

  handleProfileClick() {
    if (this.authService.isLoggedIn()) {
      const hasName = this.data?.fullName.replace(/\s/g, '').trim().length > 0 ? true : false;
      const fullName = hasName ? + ' - ' + this.data?.fullName : '';
      this.dialogRef = this.dialogService.open(
        DataExportComponent, {
        header: `View Profile Info ${fullName}`,
        width: '80%',
        data: {
          ...this.data
        },
        baseZIndex: 10000,
        breakpoints: {
          '960px': '75vw',
          '640px': '90vw'
        },
        maximizable: true
      })
    } else {
      const { customerId } = this.data;
      sessionStorage.setItem('inquiry', customerId);
      this.showLoginDialog = true;
    }
  }

  handleButtonClick(src?: string) {
    this.showLoginDialog = false;
    setTimeout(() => {
      if (src == 'login') {
        this.router.navigateByUrl('login');
      } else {
        sessionStorage.removeItem('inquiry');
      }
    }, 300);
  }

}

export type AnimationDirection = 'left' | 'right';
