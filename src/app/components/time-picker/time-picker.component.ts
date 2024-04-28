import { ChangeDetectorRef, Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit {

  @Input() value: string = '';
  @Output() selectedTime: any = new EventEmitter();
  @Input() isDisabled: any = false;
  time: any = new Date();
  defaultDate: any;

  constructor(
    private sharedService: SharedService,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.sharedService.getIsReadOnlyMode().subscribe((readOnly: any) => {
      this.isDisabled = readOnly;
    })
    if (!moment(this.value).isValid()) {
      const parsedDateTime = this.parseTimeString(this.value);
      this.time = new Date(parsedDateTime);
      this.defaultDate = new Date(parsedDateTime);
    } else {
      this.time = new Date(this.value);
      this.defaultDate = new Date(this.value);
    }
  }

  parseTimeString(timeString: any) {
    const d = new Date();
    if (timeString) {
      const time = timeString.match(/(\d+)(?::(\d\d))?\s*(p?)/);
      d.setHours(parseInt(time[1]) + (time[3] ? 12 : 0));
      d.setMinutes(parseInt(time[2]) || 0);
    }
    return d;
  }

  handleSelectionChange(event: any, src?: string) {
    this.selectedTime.emit(event);
    this.cdref.detectChanges();
  }
}
