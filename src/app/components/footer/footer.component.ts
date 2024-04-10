import { Component, OnInit } from '@angular/core';
import { faXTwitter, faFacebook } from '@fortawesome/free-brands-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { DOMAIN } from 'src/app/util/theme';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent  implements OnInit {

  twitterIcon: IconProp = faXTwitter;
  fbIcon: IconProp = faFacebook;
  domain = DOMAIN;


  constructor() { }

  ngOnInit() {}

  getFullYear() {
    return new Date().getFullYear();
  }

}
