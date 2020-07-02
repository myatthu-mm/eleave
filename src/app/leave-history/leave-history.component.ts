import { Component, OnInit, HostListener, ViewContainerRef } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from "tns-core-modules/ui/page";
import { ModalComponent } from '../ui-components/modal/modal.component';
import { History } from '../shared/models/leave-history.model';
import { LeaveService } from '../shared/services/leave.service';
import { BackendService } from '../shared/services/backend.service';
import { MonthName } from '../shared/constants';
@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.scss'],
  providers: [LeaveService, BackendService]
})
export class LeaveHistoryComponent implements OnInit {

  private historyList: Array<History>;
  startDate: DateModel;
  endDate: DateModel;
  processing: boolean;
  isEmpty: boolean;

  constructor(
    private _leaveService: LeaveService,
    private _backendService: BackendService,
    private _page: Page,
    private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef) {
  }

  get LeaveHistories(): Array<History> {
    return this.historyList;
  }

  set LeaveHistories(value) {
    this.historyList = value;
  }

  @HostListener('loaded')
  pageOnInit() {
    console.log('Leave history created................');
    this._page.actionBarHidden = false;
    this.startDate = new DateModel();
    this.endDate = new DateModel();

    this.callToLeaveHistory('2019-01-01', '2020-12-31');

  }


  ngOnInit() {
    console.log('leave history preloading...');
    this.startDate = new DateModel();
    this.endDate = new DateModel();
  }

  onFilter() {
    console.log('filter start');
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {}
    };
    this.modalService.showModal(ModalComponent, options).then((result: any) => {
      if (result && result.length > 1) {
        const startDate_str = result.split('&')[0];
        const endDate_str = result.split('&')[1];
        this.startDate.value = this.get2DigitsDate(startDate_str);
        this.startDate.label = this.getDateLabel(startDate_str);
        this.endDate.value = this.get2DigitsDate(endDate_str);
        this.endDate.label = this.getDateLabel(endDate_str);
        this.callToLeaveHistory(this.startDate.value, this.endDate.value);
      } else {
        console.log('nothing');
      }
    });
  }

  listenRemoveEvent($startEvent) {
    if ($startEvent) {
      this.startDate = new DateModel();
      if (this.endDate.value) {
        this.callToLeaveHistory(this.endDate.value, this.endDate.value);
      } else {
        this.callToLeaveHistory('2020-01-01', '2020-12-31');
      }

    } else {
      this.endDate = new DateModel();
      if (this.startDate.value) {
        this.callToLeaveHistory(this.startDate.value, this.startDate.value);
      } else {
        this.callToLeaveHistory('2020-01-01', '2020-12-31');
      }
    }
  }

  private callToLeaveHistory(_startDate: string, _endDate: string) {
    this.processing = true;
    this.isEmpty = false;
    this._backendService.getLeaveHistory(_startDate, _endDate).subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.LeaveHistories = this._leaveService.getFormattedLeaveHistories(response['leave_history_list']);
        this.processing = false;
      } else {
        this.LeaveHistories = [];
        this.isEmpty = true;
        this.processing = false;
      }
    }, (error) => {
      alert('history error');
      console.error('Error response:', error);
      this.processing = false;
    });
  }

  private getDateLabel = (_dateStr) => `${MonthName[Number(_dateStr.split('-')[1])]} ${_dateStr.split('-')[2]}, ${_dateStr.split('-')[0]}`;

  private get2DigitsDate(_dateStr) {
    let year = _dateStr.split('-')[0];
    let month = ('0' + _dateStr.split('-')[1]).slice(-2);
    let date = ('0' + _dateStr.split('-')[2]).slice(-2);
    return `${year}-${month}-${date}`
  }

}

class DateModel {
  label: string;
  value: string;
}