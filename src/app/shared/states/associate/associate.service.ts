import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Associate } from '../../models/associate.model';
import { BackendService } from '../../services/backend.service';
import { LeaveService } from '../../services/leave.service';
import { LeaveStatus } from '../../constants';
@Injectable({
  providedIn: 'root'
})
export class AssociateService {
  private _appliedLeaves = new BehaviorSubject<Associate[]>([]);
  private _approvedLeaves = new BehaviorSubject<Associate[]>([]);
  private _rejectedLeaves = new BehaviorSubject<Associate[]>([]);

  private _needtoRequestApplied_Obs$ = new BehaviorSubject(false);
  private _needtoRequestApproved_Obs$ = new BehaviorSubject(false);
  private _needtoRequestRejected_Obs$ = new BehaviorSubject(false);

  private appliedLeavesStore: { leaves: Associate[] } = { leaves: [] };
  private approvedLeavesStore: { leaves: Associate[] } = { leaves: [] };
  private rejectedLeavesStore: { leaves: Associate[] } = { leaves: [] };

  private _viewIndexStore_Obs$ = new BehaviorSubject(-1);

  readonly appliedLeaves = this._appliedLeaves.asObservable();
  readonly approvedLeaves = this._approvedLeaves.asObservable();
  readonly rejectedLeaves = this._rejectedLeaves.asObservable();


  constructor(private _backendService: BackendService, private _leaveService: LeaveService) { }

  getNeedtoRequestApplied(): Observable<boolean> {
    return this._needtoRequestApplied_Obs$.asObservable();
  }

  setNeedRequestApplied(_flag: boolean) {
    this._needtoRequestApplied_Obs$.next(_flag);
  }

  getNeedtoRequestApproved(): Observable<boolean> {
    return this._needtoRequestApproved_Obs$.asObservable();
  }

  setNeedRequestApproved(_flag: boolean) {
    this._needtoRequestApproved_Obs$.next(_flag);
  }

  getNeedtoRequestRejected(): Observable<boolean> {
    return this._needtoRequestRejected_Obs$.asObservable();
  }

  setNeedRequestRejected(_flag: boolean) {
    this._needtoRequestRejected_Obs$.next(_flag);
  }

  getPreviousViewIndex(): Observable<number> {
    return this._viewIndexStore_Obs$.asObservable();
  }

  setPreviousViewIndex(_index: number) {
    this._viewIndexStore_Obs$.next(_index);
  }

  requestAppliedLeaves() {
    console.log('applied api calling');

    // this._backendService.getAssociateLeave(LeaveStatus.Applied, '2020-01-01', '2020-12-31').subscribe(response => {
    //   const status = response['status'];
    //   if (status.code === 200) {
    //     this.appliedLeavesStore.leaves = this._leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
    //     this._appliedLeaves.next(Object.assign({}, this.appliedLeavesStore).leaves);
    //     return this.appliedLeaves;
    //   }
    // }, (error) => console.log('Could not load applied leaves.')
    // );
    this._backendService.getMockAssociateLeave('applied').subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.appliedLeavesStore.leaves = this._leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
        this._appliedLeaves.next(Object.assign({}, this.appliedLeavesStore).leaves);
        return this.appliedLeaves;
      }
    }, (error) => console.log('Could not load applied leaves.')
    );
  }

  requestApprovedLeaves() {
    // console.log('approved api calling');
    // this._backendService.getMockAssociateLeave('approved').subscribe(response => {
    //   const status = response['status'];
    //   if (status.code === 200) {
    //     this.approvedLeavesStore.leaves = this._leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
    //     this._approvedLeaves.next(Object.assign({}, this.approvedLeavesStore).leaves);
    //   }
    // }, (error) => console.log('Could not load approved leaves.')
    // );
    this._backendService.getAssociateLeave(LeaveStatus.Approved, '2020-01-01', '2020-12-31').subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.approvedLeavesStore.leaves = this._leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
        this._approvedLeaves.next(Object.assign({}, this.approvedLeavesStore).leaves);
      }
    }, (error) => console.log('Could not load approved leaves.')
    );
  }

  requestRejectedLeaves() {
    console.log('reject api calling');
    this._backendService.getAssociateLeave(LeaveStatus.Rejected, '2020-01-01', '2020-12-31').subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.rejectedLeavesStore.leaves = this._leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
        this._rejectedLeaves.next(Object.assign({}, this.rejectedLeavesStore).leaves);
      }
    }, (error) => console.log('Could not load rejected leaves.')
    );
    // this._backendService.getMockAssociateLeave('rejected').subscribe(response => {
    //   const status = response['status'];
    //   if (status.code === 200) {
    //     this.rejectedLeavesStore.leaves = this._leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
    //     this._rejectedLeaves.next(Object.assign({}, this.rejectedLeavesStore).leaves);
    //   }
    // }, (error) => console.log('Could not load rejected leaves.')
    // );
  }

}
