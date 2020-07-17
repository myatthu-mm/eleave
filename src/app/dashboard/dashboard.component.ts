import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { setString } from "tns-core-modules/application-settings";
import { Profile } from '../shared/models/profile.model';
import { Balance } from '../shared/models/balance.model';
import { History } from '../shared/models/history.model';
import { ProfileState } from '../shared/states/profile/profile.state';
import { RequestProfile } from '../shared/states/profile/profile.actions';
import { BalanceListState } from '../shared/states/balance/balance.state';
import { RequestBalanceList } from '../shared/states/balance/balance.actions';
import { HistoryListState } from '../shared/states/history/history.state';
import { RequestHistoryList } from '../shared/states/history/history.actions';
import { AlertService } from '../shared/services/alert.service';
import { LeaveService } from '../shared/services/leave.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  private profile: Profile;
  private balanceList: Balance[];
  private historyList: History[];
  processing: boolean;
  private _unsubscribe$ = new Subject();

  @Output()
  gotoHistory_event: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  isNewuserLogin: boolean;

  constructor(
    private _store: Store,
    private _page: Page,
    private _alertService: AlertService,
    private _leaveService: LeaveService) {
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
    this.isNewuserLogin = true;
  }

  @HostListener('loaded')
  pageOnInit() {
    this._page.actionBarHidden = true;
    this._unsubscribe$ = new Subject();
    this.profile = new Profile();
    this.callToProfile();
  }

  @HostListener('unloaded')
  pageOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
  }

  private callToProfile() {
    this._store.select(ProfileState.getProfile)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value && Object.keys(value).length > 1 && !this.isNewuserLogin) {
          this.profile = value;
          setString('unit', value.unit_name);
          this.processing = false;
          this.callToLeaveBalance();
        } else {
          this.processing = true;
          this.isNewuserLogin = false;
          this._store.dispatch(new RequestProfile());
        }
      }, (error) => {
        this.processing = false;
        this._alertService.showCustomError('Profile Service Error!');
      });
  }

  private callToLeaveBalance() {
    this._store.select(BalanceListState.getBalances)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value.length) {
          this.LeaveBalances = value;
          this.processing = false;
          this.callToLeaveHistory();
        } else {
          this.processing = true;
          this._store.dispatch(new RequestBalanceList());
        }
      }, (error) => {
        this.processing = false;
        this._alertService.showCustomError('Balance Service Error!');
      });
  }

  private callToLeaveHistory() {
    this._store.select(HistoryListState.getHistories)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value.length) {
          this.LeaveHistories = value.slice(0, 3);
          this.processing = false;
          this._leaveService.setPullingStrategy_Obs(false);
        } else {
          this.processing = true;
          this._store.dispatch(new RequestHistoryList());
        }
      }, (error) => {
        this.processing = false;
        this._alertService.showCustomError('History Service Error!');
      });
  }

  gotoLeaveHistory() {
    this.gotoHistory_event.emit(true);
  }


}