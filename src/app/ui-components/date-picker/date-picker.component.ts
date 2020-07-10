import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import * as ModalPicker from 'nativescript-modal-datetimepicker';
import { Subscription, Observable } from 'rxjs';
import { MonthName } from '../../shared/constants';
import { Color } from 'tns-core-modules/color';
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit, OnDestroy {

  @Input() Title: string;
  @Input() minDate?: string;
  @Input() maxDate?: string;
  @Input() minToay?: boolean;
  dateLabel: string;
  dateValue: string;

  @Output()
  getDate_event: EventEmitter<string> = new EventEmitter<string>();

  private resetEventSubscription: Subscription;
  @Input() resetEvent: Observable<void>;

  constructor() { }

  ngOnInit() {
    this.dateLabel = this.Title;
    this.resetEventSubscription = this.resetEvent.subscribe(() => {
      this.dateClear();
    });
  }

  ngOnDestroy() {
    this.resetEventSubscription.unsubscribe();
  }

  public openDatepicker() {
    const picker = new ModalPicker.ModalDatetimepicker();
    const pickerOptions = {
      title: `Choose ${this.Title}`,
      theme: 'overlay',
      overlayAlpha: 0.8,
      doneLabelColor: new Color('#fe2f2f')
    };
    if (this.minDate) {
      Object.assign(pickerOptions, { minDate: new Date(this.minDate) });
    }
    if (this.maxDate) {
      Object.assign(pickerOptions, { maxDate: new Date(this.maxDate) });
    }
    if ((!this.minDate && !this.maxDate) && this.minToay) {
      Object.assign(pickerOptions, { minDate: new Date() });
    }
    picker.pickDate(pickerOptions).then((result) => {
      // ok button
      if (result) {
        this.dateLabel = `${MonthName[result['month']]} ${result['day']}, ${result['year']}`;
        this.dateValue = result['year'] + '-' + result['month'] + '-' + result['day'];
        this.getDate_event.emit(this.get2DigitsDate(this.dateValue));
      }

    }).catch((error) => {
      console.log('Error: ' + error);
    });
  }

  public dateClear() {
    this.dateLabel = this.Title;
    this.dateValue = '';
    this.getDate_event.emit('');
  }

  private get2DigitsDate(_dateStr) {
    let year = _dateStr.split('-')[0];
    let month = ('0' + _dateStr.split('-')[1]).slice(-2);
    let date = ('0' + _dateStr.split('-')[2]).slice(-2);
    return `${year}-${month}-${date}`
  }

}
