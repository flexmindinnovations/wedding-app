import { Component, OnInit, inject } from '@angular/core';
import { faXTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { DOMAIN } from 'src/app/util/theme';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  sharedService = inject(SharedService);
  twitterIcon: IconProp = faXTwitter;
  fbIcon: IconProp = faFacebook;
  domain = DOMAIN;


  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  getFullYear() {
    return new Date().getFullYear();
  }

  handleFooterLinkClick(src: string) {
    this.sharedService.setRequestStatus(true);
    switch (src) {
      case 'home':
        this.router.navigateByUrl('');
        break;
      case 'about':
        this.router.navigateByUrl('about');
        break;
      case 'blogs':
        this.router.navigateByUrl('blog');
        break;
      case 'contact':
        this.router.navigateByUrl('contact');
        break;
      case 'events':
        this.router.navigateByUrl('events');
        break;
      case 'privacyPolicy':
        this.router.navigateByUrl('privacy-policy');
        break;
      case 'contact':
        this.router.navigateByUrl('contact');
        break;
      case 'refundPolicy':
        this.router.navigateByUrl('refund-policy');
        break;
      case 'termsAndConditions':
        this.router.navigateByUrl('terms-condition');
        break;
    }
  }

}
