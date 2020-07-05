import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { EventData } from "tns-core-modules/data/observable";
import { Switch } from "tns-core-modules/ui/switch";
import { Store } from '@ngxs/store';
import { BalanceListState } from '../shared/states/balance/balance.state';

@Component({
  selector: 'app-leave-request',
  templateUrl: './leave-request.component.html',
  styleUrls: ['./leave-request.component.scss']
})
export class LeaveRequestComponent implements OnInit {
  leaveTypeLabel: String = 'Annual Leave';
  leaveTypeValue: String = 'AL';
  leaveBalance: Number = 0;
  startDate_Value: string = '';
  endDate_Value: string = '';

  tvtext = "";
  switchState: boolean = false;
  isMorning: boolean = true;
  balanceList: any[];
  constructor(
    private _page: Page,
    private _activatedRoute: ActivatedRoute,
    private _routerExtension: RouterExtensions,
    private _store: Store) { }

  get isValidForm(): boolean {
    return (this.startDate_Value.length != 0) && (this.endDate_Value.length !== 0) && (this.leaveBalance > 0);
  }

  get isSameDates(): boolean {
    return this.startDate_Value && this.startDate_Value === this.endDate_Value;
  }

  ngOnInit() {
    console.log('Leave request preloading...');
    this._activatedRoute.queryParams.subscribe(params => {
      if (Object.keys(params).length > 0) {
        this.leaveTypeLabel = params.name;
        this.leaveTypeValue = params.id;

      }
    });
  }

  @HostListener('loaded')
  pageOnInit() {
    console.log('Leave request view created***');
    this._page.actionBarHidden = false;
    this._page.actionBar.title = 'Leave Request';
    this.balanceList = this._store.selectSnapshot(BalanceListState.balanceList)[0];
    this.leaveBalance = this.getLeaveBalance(this.leaveTypeValue);
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

  requestLeave() {
    console.log('request');

  }

  private getDaysAmount(_startDate, _endDate): number {
    const date1 = new Date(_startDate);
    const date2 = new Date(_endDate);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)) + 1;
    return diffDays;
  }


}
