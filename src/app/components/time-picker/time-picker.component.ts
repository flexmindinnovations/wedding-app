import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';


@Component({
  selector: 'time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss'],
})
export class TimePickerComponent implements OnInit, AfterViewInit {

  @Input() value: string = '';
  hoursData: any;
  minutesData: any;
  amPmData: any;

  selectedHour: any;
  selectedMinutes: any;
  selectedAmPm: any;
  @Output() selectedTime: any = new EventEmitter();

  timePickerHourId = uuidv4();
  timePickerMinuteId = uuidv4();
  timePickerAMPMId = uuidv4();
  hour: any;
  minute: any;
  ampm: any;
  timerInterval: any;

  constructor() {
    this.timerInterval = setInterval(() => {
      const d = new Date();
      let hours: any = (d.getHours() + 24) % 12 || 12;
      let minutes: any = d.getMinutes().toString();
      const amPm = d.getHours() >= 12 ? 'pm' : 'am';
      hours = hours < 10 ? '0' + hours.toString() : hours.toString();
      minutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();
      this.hour = hours.toString();
      this.minute = minutes.toString();
      this.ampm = amPm;
    }, 1000)
  }

  ngOnInit() {
    if (this.value) {
      this.hour = this.value.split(':')[0];
      this.minute = this.value.split(':')[1];
      this.ampm = this.value.split(':')[2].toLowerCase();
    }
    this.setHours();
  }

  ngAfterViewInit(): void {
    const isTimeSelected = this.hour && this.minute && this.ampm ? true : false;
    if (isTimeSelected) this.selectedTime.emit(`${this.hour}:${this?.minute}:${this?.ampm.toUpperCase()}`);
  }

  setHours() {
    const hours = [];
    for (let i = 1; i <= 12; i++) {
      const hoursObj = { id: i, value: i < 10 ? '0' + i.toString() : i.toString(), title: i < 10 ? '0' + i.toString() : i.toString() }
      hours.push(hoursObj);
    }
    this.hoursData = hours;
    this.setMinutes();
  }

  setMinutes() {
    const minutes = [];
    for (let i = 1; i <= 60; i++) {
      const minutObj = { id: i, value: i < 10 ? '0' + i.toString() : i.toString(), title: i < 10 ? '0' + i.toString() : i.toString() }
      minutes.push(minutObj);
    }
    this.minutesData = minutes;
    this.setAmPm();
  }

  setAmPm() {
    this.amPmData = [
      { id: 1, value: 'am', title: 'AM' },
      { id: 2, value: 'pm', title: 'PM' }
    ]
  }

  handleSelectionChange(event: any, src: string) {
    const value = event?.target?.value;
    clearInterval(this.timerInterval);
    switch (src) {
      case 'hour':
        this.selectedHour = value ? value.toString() : this.hour;
        break;
      case 'minutes':
        this.selectedMinutes = value ? value.toString() : this.minute;
        break;
      case 'ampm':
        this.selectedAmPm = value ? value.toString() : this.ampm;
        break;
    }
    this.selectedTime.emit(`${this.selectedHour ? this.selectedHour : this.hour}:${this.selectedMinutes ? this.selectedMinutes : this.minute}:${this.selectedAmPm ? this.selectedAmPm?.toUpperCase() : this.ampm.toUpperCase()}`);
  }
}
