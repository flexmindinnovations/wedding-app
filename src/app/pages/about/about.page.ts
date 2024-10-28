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

  cardItems = [
    {
      id: 1,
      title: 'Mr. Sunil Patil',
      designation: 'Senior Pharmacist and Social Worker, Kolhapur',
      description: "Mr. Sunil Patil is a respected figure in the Kolhapur community, known for his dual roles as a Senior Pharmacist and a committed social worker. With a rich background in healthcare, Mr. Patil brings a compassionate and humanitarian approach to his work, always striving to improve the well-being of those around him. His deep-rooted involvement in social initiatives has earned him the admiration and trust of many. At Susangam.com, Mr. Patil's insights into healthcare and community welfare guide our efforts to create a supportive environment for all our users, ensuring their emotional and physical well-being are taken care of.",
      icon: ''
    },
    {
      id: 2,
      title: 'Mr. Akshay Kshirsagar',
      designation: 'Literary Scholar and Cultural Advocate, Satara',
      description: "A prominent figure in the literary circles of Satara, Mr. Akshay Kshirsagar holds a Bachelor of Arts in Literature and has dedicated his life to the promotion of arts and culture. His love for literature and storytelling not only enhances his understanding of human emotions but also equips him with a unique perspective on cultural sensitivity. Mr. Kshirsagar's involvement with Susangam.com helps us maintain a deep respect for the cultural backgrounds of our users, ensuring that our platform is a space where everyone's stories and traditions are valued and celebrated.",
      icon: ''
    },
    {
      id: 3,
      title: 'Mr. Neeraj Tickoo',
      designation: 'Senior Manager in MNC and NGO Activist, Delhi',
      description: "Mr. Neeraj Tickoo is a dynamic professional with extensive experience as a Senior Manager in a multinational corporation. His career in the corporate sector is paralleled by his passion for social activism, particularly his hands-on work with non-governmental organizations. Based in Delhi, Mr. Tickoo's blend of business acumen and grassroots activism brings a strategic and compassionate outlook to our advisory board. His commitment to social justice and community engagement is reflected in Susangam.com's initiatives to create a fair and equitable matrimonial service that caters to all, irrespective of social or economic backgrounds.",
      icon: ''
    },
    {
      id: 4,
      title: 'Mr. Suresh Devigowda',
      designation: 'Business Leader and Social Change Enthusiast, Kalaburagi',
      description: "A well-known business figure from Kalaburagi, Mr. Suresh Devigowda is celebrated for his entrepreneurial spirit and his dedication to social change. With a successful career in business, Mr. Devigowda understands the importance of innovation and adaptability. His enthusiasm for social betterment drives his involvement in various community projects aimed at upliftment and empowerment. At Susangam.com, Mr. Devigowda's leadership and vision help us strive for continuous improvement, ensuring that our platform remains user-friendly, inclusive, and at the forefront of promoting societal harmony.",
      icon: ''
    },
  ];

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
