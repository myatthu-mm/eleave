import { Component, OnInit, HostListener, ViewContainerRef } from '@angular/core';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { Page } from "tns-core-modules/ui/page";
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HistoryListState } from '../shared/states/history/history.state';
import { ModalComponent } from '../ui-components/modal/modal.component';
import { History } from '../shared/models/history.model';
import { LeaveService } from '../shared/services/leave.service';
import { BackendService } from '../shared/services/backend.service';
import { RequestHistoryList } from '../shared/states/history/history.actions';
@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.scss']
})
export class LeaveHistoryComponent implements OnInit {

  private historyList: Array<History>;
  startDate: DateModel;
  endDate: DateModel;
  processing: boolean;
  isEmpty: boolean;
  filterIconVisibility: boolean;
  private _unsubscribe$ = new Subject();
  constructor(
    private _leaveService: LeaveService,
    private _backendService: BackendService,
    private _page: Page,
    private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private _store: Store) {
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
    this._page.actionBar.title = 'Leave History';
    this.filterIconVisibility = true;
    this.startDate = new DateModel();
    this.endDate = new DateModel();
    this._unsubscribe$ = new Subject();
    this.callToLeaveHistory();
  }

  @HostListener('unloaded')
  pageOnDestroy() {
    console.log('history destroy-----');
    this.filterIconVisibility = false;
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
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
      if (result) {
        this.startDate.value = result.startValue;
        this.startDate.label = result.startLabel;
        this.endDate.value = result.endValue;
        this.endDate.label = result.endLabel;
        this.callToLeaveHistoryWithDate(this.startDate.value, this.endDate.value);
      } else {
        console.log('nothing');
      }
    });
  }

  listenRemoveEvent($startEvent) {
    if ($startEvent) {
      this.startDate = new DateModel();
      if (this.endDate.value) {
        this.callToLeaveHistoryWithDate(this.endDate.value, this.endDate.value);
      } else {
        this.callToLeaveHistory();
      }

    } else {
      this.endDate = new DateModel();
      if (this.startDate.value) {
        this.callToLeaveHistoryWithDate(this.startDate.value, this.startDate.value);
      } else {
        this.callToLeaveHistory();
      }
    }
  }

  private callToLeaveHistory() {
    this.processing = true;
    this._store.select(HistoryListState.getHistories)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value.length) {
          this.LeaveHistories = value;
          this.processing = false;
        } else {
          this._store.dispatch(new RequestHistoryList());
        }
      }, (error) => {
        this.processing = false;
      })
  }

  private callToLeaveHistoryWithDate(_startDate: string, _endDate: string) {
    this.processing = true;
    this.isEmpty = false;
    this._backendService.getLeaveHistory(_startDate, _endDate)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(response => {
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

}

class DateModel {
  label: string;
  value: string;
}