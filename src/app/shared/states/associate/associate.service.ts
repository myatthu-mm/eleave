import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Associate } from '../../models/associate.model';
import { BackendService } from '../../services/backend.service';
import { LeaveService } from '../../services/leave.service';
@Injectable({
  providedIn: 'root'
})
export class AssociateService {
  private _appliedLeaves = new BehaviorSubject<Associate[]>([]);
  private _approvedLeaves = new BehaviorSubject<Associate[]>([]);
  private _rejectedLeaves = new BehaviorSubject<Associate[]>([]);

  private appliedLeavesStore: { leaves: Associate[] } = { leaves: [] };
  private approvedLeavesStore: { leaves: Associate[] } = { leaves: [] };
  private rejectedLeavesStore: { leaves: Associate[] } = { leaves: [] };

  readonly appliedLeaves = this._appliedLeaves.asObservable();
  readonly approvedLeaves = this._approvedLeaves.asObservable();
  readonly rejectedLeaves = this._rejectedLeaves.asObservable();

  constructor(private _backendService: BackendService, private _leaveService: LeaveService) { }

  requestAppliedLeaves() {
    this._backendService.getAssociateLeave('Applied', '2020-01-01', '2020-12-31').subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.appliedLeavesStore.leaves = this._leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
        this._appliedLeaves.next(Object.assign({}, this.appliedLeavesStore).leaves);
      }
    }, (error) => console.log('Could not load applied leaves.')
    );
  }

  requestApprovedLeaves() {
    this._backendService.getAssociateLeave('Approved', '2020-01-01', '2020-12-31').subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.approvedLeavesStore.leaves = this._leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
        this._approvedLeaves.next(Object.assign({}, this.approvedLeavesStore).leaves);
      }
    }, (error) => console.log('Could not load approved leaves.')
    );
  }

  requestRejectedLeaves() {
    this._backendService.getAssociateLeave('Rejected', '2020-01-01', '2020-12-31').subscribe(response => {
      const status = response['status'];
      if (status.code === 200) {
        this.rejectedLeavesStore.leaves = this._leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
        this._rejectedLeaves.next(Object.assign({}, this.rejectedLeavesStore).leaves);
      }
    }, (error) => console.log('Could not load rejected leaves.')
    );
  }

}
