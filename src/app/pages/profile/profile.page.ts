import { Component, ElementRef, OnInit, ViewChild, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Sidebar } from 'primeng/sidebar';
import { SharedService } from 'src/app/services/shared.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DataExportComponent } from 'src/app/components/data-export/data-export.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  isMobile: boolean = false;
  selectedStep: any = { name: 'Personal Information', route: 'personal', code: 'PI' };
  host = inject(ElementRef);
  isCancelled: boolean = false;
  isCompleted: boolean = false;
  sharedService = inject(SharedService);

  isReadOnly: boolean = false;
  isPaymentPage = signal(false);
  isPhotosPage = signal(false);

  sidebarVisible: boolean = false;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;

  profileSteps = [
    { name: 'Personal Information', route: 'personal', code: 'PI' },
    { name: 'Family Information', route: 'family', code: 'FI' },
    { name: 'Contact Information', route: 'contact', code: 'CI' },
    { name: 'Other Information', route: 'other', code: 'OI' },
    { name: 'Photos Upload', route: 'photos', code: 'PH' },
    { name: 'Payment', route: 'payment', code: 'PYMNT' }
  ];

  dialogRef: DynamicDialogRef | undefined;

  constructor(
    private deviceService: DeviceDetectorService,
    private router: Router,
    public dialogService: DialogService
  ) { }

  ngOnInit() {
    const observer = new ResizeObserver((rect) => {
      rect.forEach((box) => {
        this.isMobile = this.deviceService.isMobile();
      })
    });

    observer.observe(this.host.nativeElement);

    this.router.events.subscribe((events: any) => {
      const currentUrl = this.router.url;      
      const activeRoute = this.router.url.substring(currentUrl.lastIndexOf('/') + 1, this.router.url.length);
      if(activeRoute === 'payment') this.isPaymentPage.set(true);
      else if(activeRoute === 'photos') this.isPhotosPage.set(true);
      else {
        this.isPhotosPage.set(false);
        this.isPaymentPage.set(false);
      }
      if (activeRoute) {
        const activeItem = this.profileSteps.filter((item: any) => item.route === activeRoute);
        if (activeItem?.length) this.selectedStep = activeItem[0];
      }
    })
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
    if (event?.route) {
      this.router.navigateByUrl('profile/' + event?.route);
      this.selectedStep = event;
    }
  }

  closeSIdebar(e: any): void {
    this.sidebarRef.close(e);
  }

  getSplitterDimensions() {
    if (this.isMobile) {
      return [0, 100];
    } else {
      return [18, 100];
    }
  }

  getMinSplitterDimensions() {
    if (this.isMobile) {
      return [0, 100];
    } else {
      return [15, 80];
    }
  }

  handleExportAction() {
    this.dialogRef = this.dialogService.open(
      DataExportComponent, {
      header: 'Data Export',
      width: '80%',
      baseZIndex: 10000,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw'
      },
      maximizable: true
    }
    )

    this.dialogRef.onClose.subscribe((afterClose: any) => {
      if (afterClose) { }
    });
  }

}
