import { Component, DoCheck, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    this.sharedService.getIsReadOnlyMode().subscribe((readOnly: any) => {
      this.isDisabled = readOnly;
    })
    // console.log('value: ', this.value);
    // const cValue = moment(this.value).format();
    // console.log('cValue: ', cValue);

  }


  handleSelectionChange(event: any, src?: string) {
    this.selectedTime.emit(event);
  }
}
