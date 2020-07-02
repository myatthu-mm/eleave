import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { LeaveService } from '../shared/services/leave.service';
import { BackendService } from '../shared/services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
import { Profile } from '../shared/models/profile.model';
import { LeaveBalance } from '../shared/models/leave-balance.model';
import { History } from '../shared/models/leave-history.model';
import { PieSource } from '../shared/models/pie-source.model';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [BackendService, LeaveService]
})
export class DashboardComponent implements OnInit {
  profile: Profile;
  private balanceList: LeaveBalance[];
  private historyList: History[];
  processing: boolean;


  @Output()
  gotoHistory_event: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _routerExtension: RouterExtensions,
    private _backendService: BackendService,
    private _leaveInfoService: LeaveService,
    private _page: Page) {
    this.profile = new Profile();
    this.processing = true;
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

  get LeaveBalances(): Array<LeaveBalance> {
    return this.balanceList;
  }

  get LeaveHistories(): Array<History> {
    return this.historyList;
  }



  @HostListener('loaded')
  pageOnInit() {
    console.log('Dashboard created................');
    this._page.actionBarHidden = true;
    this.callToProfile();

  }

  ngOnInit() {
    console.log('dashboard preloading....');
  }

  private callToProfile() {
    this._backendService.getProfile().subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.profile = response['data'];
        this.callToLeaveBalance();
      }
    }, (error) => {
      alert('Profile Error');
      console.error('Error response:', error);
      this.processing = false;
    });
  }

  private callToLeaveBalance() {
    this._backendService.getLeaveBalance().subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.balanceList = response['leave_balance_list'];
        this.balanceList.map(item => {
          const pieSource = <Array<PieSource>>[
            { name: 'balance', amount: Number(item.balance) },
            { name: 'taken', amount: Number(item.taken) }
          ];
          Object.assign(item, { pieSource: pieSource })
          Object.assign(item, { balance: Number(item.balance) });
          Object.assign(item, { entitle: Number(item.entitle) });
        });
        this.callToLeaveHistory();
      }
    }, (error) => {
      alert('Balance Error');
      console.error('Error response:', error);
      this.processing = false;
    });
  }

  private callToLeaveHistory() {
    this._backendService.getLeaveHistory('2020-01-01', '2020-12-31').subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.historyList = this._leaveInfoService.getMinimalLeaves(response['leave_history_list']);
        this.processing = false;
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