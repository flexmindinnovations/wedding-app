import { animate, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { fadeIn, fadeOut, scaleIn, scaleOut, slideLeft, slideRight } from 'src/app/animations/carousel.animation';
import { environment } from 'src/environments/environment';

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
  constructor() { }

  ngOnInit() {
    const networkImage = `${this.data.imagePath1 ? this.data.imagePath1 : this.data.imagePath2 ? this.data.imagePath2 : ''}`;
    this.imagePath = networkImage ? `${environment.endpoint}/${networkImage}` : '/assets/image/image-placeholder.png';
  }

  handleIsFavourite() {
    this.isFavourite = !this.isFavourite;
  }

}

export type AnimationDirection = 'left' | 'right';
