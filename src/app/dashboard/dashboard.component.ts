import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { Store } from '@ngxs/store';
import { UpdateHistoryList } from '../shared/states/history/history.actions';
import { UpdateProfile } from '../shared/states/profile/profile.actions';
import { ProfileState } from '../shared/states/profile/profile.state';
import { BalanceListState } from '../shared/states/balance/balance.state';
import { HistoryListState } from '../shared/states/history/history.state';
import { LeaveService } from '../shared/services/leave.service';
import { BackendService } from '../shared/services/backend.service';
import { Profile } from '../shared/models/profile.model';
import { Balance } from '../shared/models/leave-balance.model';
import { History } from '../shared/models/leave-history.model';
import { PieSource } from '../shared/models/pie-source.model';
import { UpdateBalanceList } from '../shared/states/balance/balance.actions';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [BackendService, LeaveService]
})
export class DashboardComponent implements OnInit {
  profile: Profile;
  private balanceList: Balance[];
  private historyList: History[];
  processing: boolean;


  @Output()
  gotoHistory_event: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _routerExtension: RouterExtensions,
    private _store: Store,
    private _backendService: BackendService,
    private _leaveInfoService: LeaveService,
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
    this.callToProfile_State();
  }

  private callToProfile_State() {
    const profile = this._store.selectSnapshot(ProfileState.profile);
    if (Object.keys(profile).length > 0) {
      this.profile = profile;
      this.callToLeaveBalance_State();
    } else {
      this.callToProfile();
    }
  }

  private callToProfile() {
    this._backendService.getProfile().subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.profile = response['data'];
        this._store.dispatch(new UpdateProfile(this.profile));
        this.callToLeaveBalance_State();
      }
    }, (error) => {
      alert('Profile Error');
      console.error('Error response:', error);
      this.processing = false;
      this.callToLeaveBalance_State();
    });
  }

  private callToLeaveBalance_State() {
    const balanceList = this._store.selectSnapshot(BalanceListState.balanceList);
    if (balanceList.length) {
      this.LeaveBalances = balanceList[0];
      this.callToLeaveHistory_State();
    } else {
      this.callToLeaveBalance();
    }
  }

  private callToLeaveBalance() {
    this._backendService.getLeaveBalance().subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.LeaveBalances = this._leaveInfoService.getFormattedLeaveBalances(response['leave_balance_list']);
        this._store.dispatch(new UpdateBalanceList(this.LeaveBalances));
        this.callToLeaveHistory_State();
      }
    }, (error) => {
      alert('Balance Error');
      console.error('Error response:', error);
      this.processing = false;
      this.callToLeaveHistory_State();
    });
  }

  private callToLeaveHistory_State() {
    const historyList = this._store.selectSnapshot(HistoryListState.historyList);
    if (historyList.length) {
      this.LeaveHistories = historyList[0];
    } else {
      this.callToLeaveHistory();
    }

  }

  private callToLeaveHistory() {
    this._backendService.getLeaveHistory('2020-01-01', '2020-12-31').subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.LeaveHistories = this._leaveInfoService.getMinimalLeaves(response['leave_history_list']);
        this.processing = false;
        this._store.dispatch(new UpdateHistoryList(this.LeaveHistories));
      }
    }, (error) => {
      alert('history error');
      console.error('Error response:', error);
      this.processing = false;
    });
  }

  gotoLeaveHistory() {
    this.gotoHistory_event.emit(true);
  }


}