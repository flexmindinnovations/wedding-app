import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { EventService } from 'src/app/services/event/event.service';
import { SharedService } from 'src/app/services/shared.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-event-content',
  templateUrl: './event-content.component.html',
  styleUrls: ['./event-content.component.scss'],
})
export class EventContentComponent implements OnInit {


  eventInfo: any;
  eventId: any;
  createdDate: any;
  isLoading = true;
  eventImagePath: string = '';
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventId = params['id'];
      this.getEventDetails();
    });
  }

  getEventDetails() {
    this.isLoading = true;
    this.eventInfo = undefined;
    this.eventService.getEventById(this.eventId).subscribe({
      next: (response: any) => {
        if (response) {
          this.eventInfo = response;
          this.eventImagePath = `${environment.endpoint}/${this.eventInfo?.eventImagePath}`;
          this.createdDate = moment(this.eventInfo?.createdDate).format('MM-DD-YYYY');
          this.isLoading = false;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        console.log('error: ', error);
      }
    })
  }


}
