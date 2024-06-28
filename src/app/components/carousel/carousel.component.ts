import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { SLIDE_INTERVAL } from 'src/app/util/util';

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit, AfterViewInit {

  @Input() slides: any;
  currentItem = 0;
  carouselButtonStyle = `absolute top-[40%] md:lg:top-48 bg-white rounded-full shadow-md h-12 w-12 text-2xl text-wr-600 hover:text-wr-700 focus:text-wr-700 -ml-6 focus:outline-none focus:shadow-outline disabled:bg-gray-100 disabled:text-gray-200 disabled:shadow-none disabled:cursor-not-allowed`;

  carouselInterval: any;
  sliderInterval = SLIDE_INTERVAL;
  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 3
    },
    {
      breakpoint: '1220px',
      numVisible: 2,
      numScroll: 2
    },
    {
      breakpoint: '1100px',
      numVisible: 1,
      numScroll: 1
    }
  ];
  
  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    // if (this.slides) this.autoPlayCarousel();
  }

  autoPlayCarousel() {
    this.carouselInterval = setInterval(() => {
      this.handleItemClick('next', false);
    }, this.sliderInterval);
  }

  handleItemClick(src: string, isManual: boolean) {
    switch (src) {
      case 'next':
        const next = this.currentItem + 1;
        this.currentItem = next === this.slides.length ? 0 : next;
        break;
      case 'prev':
        const prev = this.currentItem - 1;
        this.currentItem = prev < 0 ? this.slides.length - 1 : prev;
        break;
    }
    this.slides.forEach((item: any) => {
      item.isDisplayed = false;
    })
    this.slides[this.currentItem].isDisplayed = true;
    if (isManual) this.resetInterval();
  }

  resetInterval() {
    this.sliderInterval = SLIDE_INTERVAL;
  }

}
