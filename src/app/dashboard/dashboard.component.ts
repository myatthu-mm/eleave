import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Profile } from '../shared/models/profile.model';
import { Balance } from '../shared/models/balance.model';
import { History } from '../shared/models/history.model';
import { Store } from '@ngxs/store';
import { ProfileState } from '../shared/states/profile/profile.state';
import { RequestProfile } from '../shared/states/profile/profile.actions';
import { BalanceListState } from '../shared/states/balance/balance.state';
import { RequestBalanceList } from '../shared/states/balance/balance.actions';
import { HistoryListState } from '../shared/states/history/history.state';
import { RequestHistoryList } from '../shared/states/history/history.actions';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  profile: Profile;
  private balanceList: Balance[];
  private historyList: History[];
  processing: boolean;
  private _unsubscribe$ = new Subject();

  @Output()
  gotoHistory_event: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private _store: Store,
    private _page: Page) {
    this.profile = new Profile();
  }

  get Name(): string {
    return this.profile.last_name || '';
  }

  get JobPosition(): string {
    return this.profile.job_category_name + ', ' + this.profile.unit_name;
  }

  get ProfileImage(): string {
    if (this.profile.title === 'U') {
      return '~/assets/images/employee-men.png'
    }
    return '~/assets/images/employee.png';
  }

  get LeaveBalances(): Array<Balance> {
    return this.balanceList;
  }

  set LeaveBalances(value) {
    this.balanceList = value;
  }

  get LeaveHistories(): Array<History> {
    return this.historyList;
  }

  set LeaveHistories(value) {
    this.historyList = value;
  }

  ngOnInit() {
    console.log('dashboard preloading....');
  }

  @HostListener('loaded')
  pageOnInit() {
    console.log('Dashboard created***');
    this._page.actionBarHidden = true;
    this.callToProfile();
  }

  @HostListener('unloaded')
  pageOnDestroy() {
    console.log('dashboard destroy-----');
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  private callToProfile() {
    this.processing = true;
    this._store.select(ProfileState.getProfile)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (Object.keys(value).length > 1) {
          this.profile = value;
          this.processing = false;
          this.callToLeaveBalance();
        } else {
          this._store.dispatch(new RequestProfile());
        }
      }, (error) => {
        this.processing = false;
      });
  }

  private callToLeaveBalance() {
    this.processing = true;
    this._store.select(BalanceListState.getBalances)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value.length) {
          this.LeaveBalances = value;
          this.processing = false;
          this.callToLeaveHistory();
        } else {
          this._store.dispatch(new RequestBalanceList());
        }
      }, (error) => {
        this.processing = false;
      });
  }

  private callToLeaveHistory() {
    this.processing = true;
    this._store.select(HistoryListState.getHistories)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value.length) {
          this.LeaveHistories = value.slice(0, 3);
          this.processing = false;
        } else {
          this._store.dispatch(new RequestHistoryList());
        }
      }, (error) => {
        this.processing = false;
      });
  }

  gotoLeaveHistory() {
    this.gotoHistory_event.emit(true);
  }


}