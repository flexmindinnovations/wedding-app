import { AfterViewInit, Component, ElementRef, NgZone, OnInit, inject } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DOMAIN } from 'src/app/util/theme';
import { Message } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RegisterUserComponent } from 'src/app/modals/register-user/register-user.component';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit, AfterViewInit {
  deviceService = inject(DeviceDetectorService);
  host = inject(ElementRef);
  ngZone = inject(NgZone);
  isLoggedIn: boolean = false;
  router = inject(Router);
  isMobile: boolean = false;
  isDesktop: boolean = true;
  domain = DOMAIN;
  dialogRef: DynamicDialogRef | undefined;
  sharedService = inject(SharedService);

  constructor(
    private authService: AuthService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isMobile = this.deviceService.isMobile();
        this.isDesktop = this.deviceService.isDesktop();
      })
    });

    observer.observe(this.host.nativeElement);
  }

  ngAfterViewInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  handleRegister() {
    this.dialogRef = this.dialogService.open(RegisterUserComponent, {
      header: 'Sign up',
      width: '25%',
      baseZIndex: 10000,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      maximizable: false
    })

    this.dialogRef.onClose.subscribe((afterClose: any) => {
      if (afterClose) { }
    });
  }

  handleExploreProfiles() {
    this.router.navigate(['/filter-profile']);
    this.sharedService.setRequestStatus(true);
  }

}
