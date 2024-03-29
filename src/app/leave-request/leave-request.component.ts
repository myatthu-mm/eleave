import { Component, OnInit, HostListener } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { EventData } from "tns-core-modules/data/observable";
import { Switch } from "tns-core-modules/ui/switch";
import { Store } from '@ngxs/store';
import { Subscription, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TextView } from "tns-core-modules/ui/text-view";
import { isAndroid } from "tns-core-modules/platform";
import { BalanceListState } from '../shared/states/balance/balance.state';
import { LeaveService } from '../shared/services/leave.service';
import { BackendService } from '../shared/services/backend.service';
import { RequestBalanceList, UpdateBalanceList } from '../shared/states/balance/balance.actions';
import { AddHistoryItem } from '../shared/states/history/history.actions';
import { AlertService } from '../shared/services/alert.service';

import * as app from "tns-core-modules/application";
import { LeaveStatus } from '../shared/constants';
declare var android: any;

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss'],
})
export class LeaveRequestComponent implements OnInit {
  leaveTypeLabel: String = 'Annual Leave';
  leaveTypeValue: string = 'AL';
  leaveBalance: Number = 0;
  startDate_Value: string = '';
  endDate_Value: string = '';

  tvtext = "";
  switchState: boolean = false;
  isMorning: boolean = true;
  balanceList: any[];
  processing: boolean;
  private _subscriptions = new Subscription();
  private _unsubscribe$ = new Subject();
  private _resetEventSubject: Subject<void> = new Subject<void>();
  constructor(
    private _page: Page,
    private _routerExtension: RouterExtensions,
    private _store: Store,
    private _leaveService: LeaveService,
    private _backendService: BackendService,
    private _alertService: AlertService) {
  }

  get isValidForm(): boolean {
    return (this.startDate_Value.length != 0) && (this.endDate_Value.length !== 0) && (this.leaveBalance > 0);
  }

  get isSameDates(): boolean {
    return this.startDate_Value && this.startDate_Value === this.endDate_Value;
  }

  ngOnInit() {
    if (isAndroid) {
      let window = app.android.startActivity.getWindow();
      window.setSoftInputMode(
        android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN
      );
    }
  }

  @HostListener('loaded')
  pageOnInit() {
    this._page.actionBarHidden = false;
    this._page.actionBar.title = 'Request Leave';
    this._unsubscribe$ = new Subject();
    this._subscriptions.add(
      this._leaveService.getLeaveTypeObs().subscribe(data => {
        if (data) {
          this.leaveTypeLabel = data.name;
          this.leaveTypeValue = data.id;
        }
      })
    );

    this.callToLeaveBalance();
  }

  @HostListener('unloaded')
  pageOnDestroy() {
    this._subscriptions.unsubscribe();
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
  }

  private callToLeaveBalance() {
    this.processing = true;
    this._store.select(BalanceListState.getBalances)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value.length) {
          this.balanceList = value;
          this.processing = false;
          this.leaveBalance = this.getLeaveBalance(this.leaveTypeValue);
        } else {
          this._store.dispatch(new RequestBalanceList());
        }
      }, (error) => {
        this.processing = false;
      })
  }

  getLeaveBalance(_leaveCode: String) {
    const selectedLeave = this.balanceList.find(item => item.leave_type_code === _leaveCode);
    if (selectedLeave) {
      return selectedLeave.balance;
    }
    return 0;
  }

  chooseLeaveType() {
    this._routerExtension.navigate(['/types']);
  }

  listenStartDate_Event($event) {
    this.startDate_Value = $event;
  }

  listenEndDate_Event($event) {
    this.endDate_Value = $event;
  }

  onCheckedChange(args: EventData) {
    let sw = args.object as Switch;
    this.switchState = sw.checked;
  }

  onTextChange(args: EventData) {
    const tv = args.object as TextView;
    this.tvtext = tv.text;
  }

  requestLeave() {
    const leaveTypeCode = this.leaveTypeValue;
    const startDate = this.startDate_Value;
    const endDate = this.endDate_Value;
    const duration = this.getDaysAmount(this.startDate_Value, this.endDate_Value);
    const remark = this.tvtext;
    let halftype = '';
    if (this.switchState) {
      halftype = this.isMorning ? '1' : '2';
    }
    this.processing = true;
    this._backendService.saveLeave(leaveTypeCode, startDate, endDate, duration, remark, halftype)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(response => {
        const status = response['status'];
        if (status.code == 200) {
          // update balance
          const index = this.balanceList.findIndex(item => item.leave_type_code === leaveTypeCode);
          const updatedBalance = { ...this.balanceList[index], balance: this.balanceList[index].balance - Number(duration) };
          const updatedBalanceList = [
            ...this.balanceList.slice(0, index), updatedBalance,
            ...this.balanceList.slice(index + 1),
          ];
          this._store.dispatch(new UpdateBalanceList(updatedBalanceList));

          //  update history list
          const appliedItem = this._leaveService.getPreparedAppliedHistory(leaveTypeCode, startDate, endDate, duration, remark);
          this._store.dispatch(new AddHistoryItem(appliedItem));

          this._alertService.showSuccess('Leave request');
          this.formReset();
        } else {
          this._alertService.showError('Leave request');
        }
        this.processing = false;
      }, error => {
        this._alertService.showCustomError('Leave Request Service Error!')
        console.error('Error response:', error);
        this.processing = false;
      })
  }

  formReset() {
    this.startDate_Value = '';
    this.endDate_Value = '';
    this.tvtext = '';
    this._resetEventSubject.next();
  }

  private getDaysAmount(_startDate, _endDate): string {
    const date1 = new Date(_startDate);
    const date2 = new Date(_endDate);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)) + 1;
    return `${diffDays}`;
  }


}
