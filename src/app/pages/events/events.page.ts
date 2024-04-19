import { Component, HostListener, OnInit, inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { convert } from 'html-to-text';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import { EventService } from 'src/app/services/event/event.service';
import { SharedService } from 'src/app/services/shared.service';
import { DOMAIN } from 'src/app/util/theme';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-events',
  templateUrl: './events.page.html',
  styleUrls: ['./events.page.scss'],
})
export class EventsPage implements OnInit {

  eventService = inject(EventService);
  router = inject(NavController);
  deviceDetector = inject(DeviceDetectorService);
  sharedService = inject(SharedService);
  eventList: any[] = [];

  domain = DOMAIN;

  subs: Subscription[] = [];

  endpoint = environment.endpoint;

  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    this.handlePopState();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.getEventList();
  }

  handlePopState() {
    // console.log('handlePopState: ');

    this.getEventList();
  }

  getEventList() {
    this.subs.push(
      this.eventService.getEventList().subscribe({
        next: (response: any) => {
          if (response) {
            this.eventList = response;
          }
        },
        error: (error: any) => {
          console.log('error: ', error);
        }
      })
    );
  }

  extractPlainTextFromRichText(richText: any): string {
    const isMobile = this.deviceDetector.isMobile();
    const htmlText = convert(richText).substring(0, 25).concat('...');
    return htmlText;
  }

  getImagePath(item: any) {
    const imagePath = this.endpoint + '/' + item?.eventImagePath;
    return imagePath;
  }

  handleEventItemClick(eventInfo: any) {
    this.router.navigateForward(`events/details/${eventInfo?.eventId}`);
    setTimeout(() => {
      this.sharedService.eventData.next(eventInfo);
    }, 200)
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
    this.eventList = [];
  }
}
