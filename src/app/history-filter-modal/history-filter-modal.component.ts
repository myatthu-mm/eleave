import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Page } from "tns-core-modules/ui/page";
import { MonthName } from '../shared/constants';

@Component({
  selector: 'app-history-filter-modal',
  templateUrl: './history-filter-modal.component.html',
  styleUrls: ['./history-filter-modal.component.scss']
})
export class HistoryFilterModalComponent implements OnInit {

  startDate_Value: string = '';
  endDate_Value: string = '';

  constructor(
    private params: ModalDialogParams,
    private _page: Page
  ) { }

  get isValidForm(): boolean {
    return (this.startDate_Value.length !== 0 && this.endDate_Value.length !== 0);
  }

  ngOnInit() {
    this._page.actionBarHidden = true;
  }

  listenStartDate_Event($event) {
    this.startDate_Value = $event;
  }

  listenEndDate_Event($event) {
    this.endDate_Value = $event;
  }

  private getDateLabel = (_dateStr) => `${MonthName[Number(_dateStr.split('-')[1])]} ${_dateStr.split('-')[2]}, ${_dateStr.split('-')[0]}`;

  public applyFilter() {
    const response = {
      startValue: this.startDate_Value,
      startLabel: this.getDateLabel(this.startDate_Value),
      endValue: this.endDate_Value,
      endLabel: this.getDateLabel(this.endDate_Value)
    }
    this.params.closeCallback(response);
  }

  public onClose() {
    this.params.closeCallback();
  }

}
