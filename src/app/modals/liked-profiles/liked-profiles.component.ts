import { Component, ElementRef, OnInit, inject } from '@angular/core';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertType } from 'src/app/enums/alert-types';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user/user.service';
import { DOMAIN } from 'src/app/util/theme';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-liked-profiles',
  templateUrl: './liked-profiles.component.html',
  styleUrls: ['./liked-profiles.component.scss'],
})
export class LikedProfilesComponent implements OnInit {
  isMobile: boolean = false;
  host = inject(ElementRef);
  selectedProfile: any;
  isLoading: boolean = false;
  isLoggedIn = false;
  isDataLoaded: boolean = false;
  imageUrlPrefix = environment.endpoint;

  userInfo: any;
  personalInfoModel: any;
  familyInfoModel: any;
  contactInfoModel: any;
  otherInfoModel: any;
  imageInfoModel: any;
  profileList: any[] = [];
  constructor(
    private deviceService: DeviceDetectorService,
    private dialogRef: DynamicDialogRef,
    private dialogConfig: DynamicDialogConfig,
    private authService: AuthService,
    private alertService: AlertService,
    private userService: UserService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isMobile = this.deviceService.isMobile();
      })
    });

    observer.observe(this.host.nativeElement);
    const profileList = this.dialogConfig.data;
    this.profileList = profileList.map((item: any) => {
      item['fullName'] = item.fullName.replace(/\s/g, '') ? item.fullName : 'Unknown';
      return item;
    })
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  handleProfileClick(item: any) {
    this.getUserDetails(item?.customerId);
  }

  getUserDetails(userId: any) {
    this.isLoading = true;
    this.authService.getCustomerForPDFById(userId).subscribe({
      next: (data: any) => {
        if (data) {
          const { personalInfoModel, familyInfoModel, contactInfoModel, otherInfoModel, imageInfoModel } = data;
          this.personalInfoModel = JSON.parse(JSON.stringify(personalInfoModel));

          personalInfoModel['dateOfBirth'] = moment(personalInfoModel['dateOfBirth']).format('dddd, D MMMM YYYY');
          personalInfoModel['timeOfBirth'] = this.getTime(personalInfoModel['timeOfBirth']);
          personalInfoModel['isPatrika'] = personalInfoModel['isPatrika'] == true ? 'Yes' : 'No';
          personalInfoModel['isPhysicallyAbled'] = personalInfoModel['isPhysicallyAbled'] == true ? 'Yes' : 'No';
          personalInfoModel['spectacles'] = personalInfoModel['spectacles'] == true ? 'Yes' : 'No';

          const userInfo = {
            personalInfo: this.convertObjectToList(personalInfoModel),
            familyInfo: this.convertObjectToList(familyInfoModel),
            contactInfo: this.convertObjectToList(contactInfoModel),
            otherInfo: this.convertObjectToList(otherInfoModel),
            photos: this.convertObjectToList(imageInfoModel)
          };
          this.personalInfoModel = userInfo?.personalInfo;
          this.familyInfoModel = userInfo?.familyInfo;
          this.contactInfoModel = userInfo?.contactInfo;
          this.otherInfoModel = userInfo?.otherInfo;
          this.imageInfoModel = userInfo?.photos;

          this.userInfo = userInfo;
          this.isDataLoaded = true;
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        if (error) {
          this.isLoading = false;
          this.alertService.setAlertMessage('Error: Failed to load user details', AlertType.error);
          this.selectedProfile = null;
        }
      }
    })
  }

  convertObjectToList(obj: Record<string, any>): ObjectType[] {
    const convertedList: ObjectType[] = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const title = this.transformString(key);
        const value = obj[key];
        convertedList.push({ title, value });
      }
    }
    return convertedList;
  }


  transformString(input: any) {
    let stringWithSpace = input.replace(/([a-z])([A-Z])/g, '$1 $2');
    if (stringWithSpace.includes('Id')) stringWithSpace = stringWithSpace.replace('Id', '');
    stringWithSpace = stringWithSpace.charAt(0).toUpperCase() + stringWithSpace.slice(1);
    return stringWithSpace;
  }


  getTime(time: any) {
    if (moment(time).isValid()) {
      return moment(time).format('h:mm A');
    } else {
      const parseString = moment(this.parseTimeString(time)).format('h:mm A');
      return parseString;
    }
  }

  parseTimeString(timeString: any) {
    const d = new Date();
    if (timeString) {
      const time = timeString.match(/(\d+)(?::(\d\d))?\s*(p?)/);
      d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
      d.setMinutes(parseInt(time[2]) || 0);
    }
    return d;
  }


  getImageUrl(item: any) {
    return `${this.imageUrlPrefix}/${item?.value}`;
  }


  getSplitterDimensions() {
    if (this.isMobile) {
      return [0, 100];
    } else {
      return [22, 78];
    }
  }

  getMinSplitterDimensions() {
    if (this.isMobile) {
      return [0, 100];
    } else {
      return [15, 80];
    }
  }

  handleActionClick(src: string) {
    switch (src) {
      case 'cancel':
        this.dialogRef.close();
        break;
    }
  }

  removeFromFavourites() {
    const customerId = this.selectedProfile?.customerId;
    const userId = JSON.parse(localStorage.getItem('user') || '{}')?.user;
    this.handleIsFavourite(userId, customerId);
  }

  connectOnWhatsApp() {
    const customerId = this.selectedProfile?.customerId;
    const mobileNo = this.selectedProfile?.mobileNo.replace(/\s/g, '');
    const domainName = DOMAIN.toLocaleLowerCase();
    const userId = JSON.parse(localStorage.getItem('user') || '{}')?.user;
    if (userId && mobileNo) {
      const messageText = `We got your marriage profile link \n https://www.${domainName}.com/profiles/view/${userId} on https://www.${domainName}.com \n
  We would like to further talk on this proposal.`;
      const link = `https://wa.me/+91${mobileNo}?text=${messageText}`;
      const anchorTag = document.createElement('a');
      anchorTag.href = link;
      anchorTag.click();
    } else {
      if (!mobileNo) {
        this.alertService.setAlertMessage('Mobile number is not updated, please update your mobile number to send message.', AlertType.error);
      }
    }
  }

  handleIsFavourite(likerId: any, likedId: any) {
    const isLoggedIn = this.authService.isLoggedIn();
    if (isLoggedIn) {
      const payload = {
        customerLikeId: 0,
        likerId: likerId,
        likedId: likedId,
        isLike: false
      };
      this.userService.setFavourite(payload).subscribe({
        next: (response: any) => {
          if (response) {
            this.alertService.setAlertMessage(response?.message, AlertType.success);
            this.selectedProfile = null;
          }
          this.getUpdatedFavouriteProfileList(likerId);
        },
        error: (error: any) => {
          this.alertService.setAlertMessage('Failed to add profile to favourites', AlertType.error);
        }
      })
    }
  }

  getUpdatedFavouriteProfileList(userId: any) {
    this.userService.getFavouriteProfileList(userId).subscribe({
      next: (response) => {
        if (response) {
          console.log('response: ', response);
          const profileList = response;
          this.profileList = profileList.map((item: any) => {
            item['fullName'] = item.fullName.replace(/\s/g, '') ? item.fullName : 'Unknown';
            return item;
          })
          this.sharedService.setFavouriteProfiles.next(profileList);
        }
      },
      error: (error) => {
        this.alertService.setAlertMessage('Error: Something went wrong ', AlertType.error)
      }
    });
  }

}

interface ObjectType {
  title: string;
  value: any;
}
