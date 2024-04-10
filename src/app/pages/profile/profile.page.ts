import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  isMobile: boolean = false;
  selectedStep: any = { name: 'Personal Information', code: 'PI' };
  host = inject(ElementRef);
  isCancelled: boolean = false;
  isCompleted: boolean = false;
  sharedService = inject(SharedService);

  isReadOnly: boolean = false;

  profileSteps = [
    { name: 'Personal Information', code: 'PI' },
    { name: 'Family Information', code: 'FI' },
    { name: 'Contact Information', code: 'CI' },
    { name: 'Other Information', code: 'OI' },
    { name: 'Photos Upload', code: 'PH' }
  ];

  constructor(
    private deviceService: DeviceDetectorService
  ) { }

  ngOnInit() {
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isMobile = this.deviceService.isMobile();
      })
    });

    observer.observe(this.host.nativeElement);
  }


  handleCancelAction(event: any) {
    this.isCancelled = event;
  }

  handleViewChange(event: any) {
    this.sharedService.isReadOnlyMode.next(this.isReadOnly);
  }

  handleCompleteAction(event: any) {
    this.isCompleted = event;
  }

  handleListItemChange(event: any) {

  }

}
