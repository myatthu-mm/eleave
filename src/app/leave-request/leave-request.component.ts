import { Component, OnInit, HostListener } from '@angular/core';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { EventData } from "tns-core-modules/data/observable";
import { Switch } from "tns-core-modules/ui/switch";
import { Store } from '@ngxs/store';
import { Subscription, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { TextView } from "tns-core-modules/ui/text-view";
import { BalanceListState } from '../shared/states/balance/balance.state';
import { LeaveService } from '../shared/services/leave.service';
import { BackendService } from '../shared/services/backend.service';
import { RequestBalanceList } from '../shared/states/balance/balance.actions';
import { RequestHistoryList } from '../shared/states/history/history.actions';

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
    private _backendService: BackendService) { }

  get isValidForm(): boolean {
    return (this.startDate_Value.length != 0) && (this.endDate_Value.length !== 0) && (this.leaveBalance > 0);
  }

  get isSameDates(): boolean {
    return this.startDate_Value && this.startDate_Value === this.endDate_Value;
  }

  ngOnInit() {
    console.log('Leave request preloading...');
  }

  @HostListener('loaded')
  pageOnInit() {
    console.log('Leave request view created***');
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
    console.log('request destroy-----');
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
    console.log('request');
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
          this._store.dispatch(new RequestBalanceList()).pipe(tap((res) => {
            console.log('balance updated...');
            this._store.dispatch(new RequestHistoryList);
          }));
          alert(`Leave ${status.message}`);
          this.formReset();
        } else {
          alert(status.message);
        }
        this.processing = false;
      }, error => {
        alert('Save leave Error');
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
