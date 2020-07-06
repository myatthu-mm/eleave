import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { ProfileState } from '../states/profile/profile.state';
import { UpdateProfile } from '../states/profile/profile.actions';
import { BalanceListState } from '../states/balance/balance.state';
import { UpdateBalanceList } from '../states/balance/balance.actions';
import { HistoryListState } from '../states/history/history.state';
import { UpdateHistoryList } from '../states/history/history.actions';
import { BackendService } from './backend.service';
import { LeaveService } from './leave.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor(
    private _store: Store,
    private _backendService: BackendService,
    private _leaveService: LeaveService
  ) { }

  private createObserable(data: any) {
    return new Observable(observer => {
      observer.next(data);
    });
  }

  public getProfile(): Observable<any> {
    const value = this._store.selectSnapshot(ProfileState.profile);
    if (Object.keys(value).length > 0) {
      return this.createObserable(value);
    }
    this._backendService.getProfile().subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        const profile = response['data'];
        this._store.dispatch(new UpdateProfile(profile));
        return this.createObserable(profile);
      }
    }, (error) => {
      alert('Profile Error');
      console.error('Error response:', error);
    });
  }

  public getLeavebalances(_apiForce?: boolean): Observable<any> {

    const value = this._store.selectSnapshot(BalanceListState.balanceList);
    if (value.length && !_apiForce) {
      return this.createObserable(value[0]);
    }
    this._backendService.getLeaveBalance().subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        const leaveBalances = this._leaveService.getFormattedLeaveBalances(response['leave_balance_list']);
        this._store.dispatch(new UpdateBalanceList(leaveBalances));
        return this.createObserable(leaveBalances);
      }
    }, (error) => {
      alert('balance error');
      console.error('Error response:', error);
    })
  }

  public getLeavehistories(): Observable<any> {
    const value = this._store.selectSnapshot(HistoryListState.historyList);
    if (value.length) {
      return this.createObserable(value[0]);
    }
    this._backendService.getLeaveHistory('2020-01-01', '2020-12-31').subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        const leaveHistories = this._leaveService.getFormattedLeaveHistories(response['leave_history_list']);
        this._store.dispatch(new UpdateHistoryList(leaveHistories));
        return this.createObserable(leaveHistories);
      }
    }, (error) => {
      alert('history error');
      console.error('Error response:', error);
    })
  }






}
