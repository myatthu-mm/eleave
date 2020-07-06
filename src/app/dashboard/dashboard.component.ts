import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { StateService } from '../shared/services/state.service';
import { Profile } from '../shared/models/profile.model';
import { Balance } from '../shared/models/balance.model';
import { History } from '../shared/models/history.model';
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
    private _stateService: StateService,
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
    this._stateService.getProfile()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(profile => {
        this.profile = profile;
      }, (error) => {
      }, () => {
        this.processing = false;
        console.log("profile complete")
        this.callToLeaveBalance();
      });
  }

  private callToLeaveBalance() {
    this.processing = true;
    this._stateService.getLeavebalances()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(list => {
        this.LeaveBalances = list;
      }, (error) => {
      }, () => {
        this.processing = false;
        console.log("balance complete")
        this.callToLeaveHistory();
      });
  }

  private callToLeaveHistory() {
    this.processing = true;
    this._stateService.getLeavehistories()
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(list => {
        this.LeaveHistories = list.slice(0, 3);
      }, (error) => { },
        () => {
          this.processing = false;
          console.log("history complete")
        });
  }

  gotoLeaveHistory() {
    this.gotoHistory_event.emit(true);
  }


}