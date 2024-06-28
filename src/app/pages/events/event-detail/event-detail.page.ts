import { trigger, transition, useAnimation } from '@angular/animations';
import { Component, NgZone, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { slideLeft, slideRight } from 'src/app/animations/carousel.animation';
import { EventService } from 'src/app/services/event/event.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.page.html',
  styleUrls: ['./event-detail.page.scss'],
  animations: [
    trigger('slideLeftRight', [
      transition('* => *', [useAnimation(slideLeft, { params: { time: '900ms' } })]),
      transition('* => *', [useAnimation(slideRight, { params: { time: '900ms' } })])
    ])
  ]
})
export class EventDetailPage implements OnInit {


  route = inject(ActivatedRoute);
  eventService = inject(EventService);
  sharedService = inject(SharedService);
  router = inject(Router);
  eventId: any;
  eventInfo: any;
  eventList: any[] = [];
  filteredEventList: any[] = [];

  subs: Subscription[] = [];
  endpoint = environment.endpoint;

  constructor(
    private zone: NgZone
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.getEventList();
  }

  getEventList() {
    this.eventList = [];
    this.subs.push(
      this.eventService.getEventList().subscribe({
        next: (response: any) => {
          if (response) {
            this.eventList = response;
            this.filteredEventList = JSON.parse(JSON.stringify(this.eventList));
            const eventList = this.eventList?.filter((item: any) => item.eventId != this.eventId);
            this.filteredEventList = eventList;
          }
        },
        error: (error: any) => {
          console.log('error: ', error);
        }
      })
    );
  }


  handleEventItemClick(eventInfo: any) {
    this.eventId = eventInfo?.eventId;
    this.router.navigate([`events/details/${this.eventId}`]);
    this.filteredEventList = [];
    setTimeout(() => {
      const eventList = this.eventList.filter((item: any) => item.eventId != this.eventId);
      this.filteredEventList = eventList;
    }, 300)
  }

  getImagePath(item: any) {
    const imagePath = this.endpoint + '/' + item?.eventImagePath;
    return imagePath;
  }


  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.eventList = [];
    this.eventInfo = undefined;
  }

}
