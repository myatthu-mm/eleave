import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import * as ModalPicker from 'nativescript-modal-datetimepicker';
import { Page } from "tns-core-modules/ui/page";
import { MonthName } from '../../shared/constants';
@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  startDate: Date = new Date();
  startDate_label: string = 'Start Date';
  endDate_label: string = 'End Date';
  startDate_model: string = '';
  endDate_model: string = '';

  constructor(
    private params: ModalDialogParams,
    private _page: Page
  ) { }

  ngOnInit() {
    this._page.actionBarHidden = true;
  }

  onStartDateChanged(args) {
    console.log("Date start object: " + args.value);
  }

  onEndDateChanged(args) {
    console.log("Date End value: " + args.value);
  }

  public openStartDatepicker() {
    const picker = new ModalPicker.ModalDatetimepicker();
    picker.pickDate({
      title: 'Choose Start Date',
      theme: 'overlay',
      overlayAlpha: 0.8,
      maxDate: new Date()
    }).then((result) => {
      this.startDate_label = `${MonthName[result['month']]} ${result['day']}, ${result['year']}`;
      this.startDate_model = result['year'] + '-' + result['month'] + '-' + result['day'];
      console.log(result['year'] + '-' + result['month'] + '-' + result['day']);
    }).catch((error) => {
      console.log('Error: ' + error);
    });
  }

  public openEndDatepicker() {
    const picker = new ModalPicker.ModalDatetimepicker();
    picker.pickDate({
      title: 'Choose End Date',
      theme: 'overlay',
      overlayAlpha: 0.8,
      maxDate: new Date()
    }).then((result) => {
      this.endDate_label = `${MonthName[result['month']]} ${result['day']}, ${result['year']}`;
      this.endDate_model = result['year'] + '-' + result['month'] + '-' + result['day'];
      console.log(result['year'] + '-' + result['month'] + '-' + result['day']);
    }).catch((error) => {
      console.log('Error: ' + error);
    });
  }

  public startDate_Clear() {
    this.startDate_label = 'Start Date';
    this.startDate_model = '';
  }

  public endDate_Clear() {
    this.endDate_label = 'End Date';
    this.endDate_model = '';
  }

  public onClose() {
    this.params.closeCallback(`${this.startDate_model}&${this.endDate_model}`);
  }

}
