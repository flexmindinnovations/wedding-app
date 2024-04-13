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
    this.time = new Date(this.value);
    this.defaultDate = new Date(this.value);
  }


  handleSelectionChange(event: any, src?: string) {
    this.selectedTime.emit(event);
    this.cdref.detectChanges();
  }
}
