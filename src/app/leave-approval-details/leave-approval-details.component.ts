import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventData } from "tns-core-modules/ui/page";
import { TextView } from 'tns-core-modules/ui/text-view';
import { confirm } from "tns-core-modules/ui/dialogs";
import { Approval } from '../shared/models/approval.model';
import { Associate } from '../shared/models/associate.model';
import { BackendService } from '../shared/services/backend.service';
import { AssociateService } from '../shared/states/associate/associate.service';
import { LeaveStatus } from '../shared/constants';
@Component({
  selector: 'app-leave-approval-details',
  templateUrl: './leave-approval-details.component.html',
  styleUrls: ['./leave-approval-details.component.scss']
})
export class LeaveApprovalDetailsComponent implements OnInit {
  data: Associate;
  payload: Approval;
  resetShow: boolean = false;
  resetDisabled: boolean = false;
  approvalDisabled: boolean = false;
  textArea = "";
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _backendService: BackendService,
    private _associateService: AssociateService
  ) { }

  ngOnInit() {
    if (this._activatedRoute.snapshot.queryParamMap) {
      const response = this._activatedRoute.snapshot.queryParams;
      this.data = JSON.parse(response.data);
      this.payload = JSON.parse(response.payload);
      this.resetShow = this.data.status === '1' ? false : true;
    }
  }

  onApprove(_status: string) {
    this.approvalDisabled = true;
    const payload = { ...this.payload };
    payload.status = _status;
    payload.approverComment = this.textArea;
    this._backendService.approveLeave(payload).subscribe(response => {
      const status = response['status'];
      const statusLabel = _status === '2' ? LeaveStatus.Approved : LeaveStatus.Rejected;
      this.data.status = _status;
      if (status.code == 200) {
        alert(`${statusLabel} success!`);
        this._associateService.setPreviousViewIndex(0);
        // this._associateService.setNeedRequestApplied(true);
        switch (_status) {
          case '2': this._associateService.setNeedRequestApproved(true); break;
          default: this._associateService.setNeedRequestRejected(true); break;
        }
      } else {
        alert(`${statusLabel} failed!`);
        this.approvalDisabled = false;
      }
    }, (error) => {
      alert(`failed!`);
      this.approvalDisabled = false;
    });
  }

  onReset() {
    this.resetDisabled = true;
    console.log(this.data.status);
    const statusLabel = this.data.status === '2' ? LeaveStatus.Approved : LeaveStatus.Rejected;
    let options = {
      title: "Reset Warning",
      message: `Are you sure to reset the ${statusLabel}?`,
      okButtonText: "Yes",
      cancelButtonText: "Cancel",
    };
    confirm(options).then((choose: boolean) => {
      if (choose) {
        const payload = { ...this.payload };
        payload.status = '1';
        this._backendService.approveLeave(payload).subscribe(response => {
          const status = response['status'];
          if (status.code == 200) {
            alert(`Reset success!`);

            if (this.data.status === '2') {
              this._associateService.setPreviousViewIndex(1);
              this._associateService.setNeedRequestApplied(true);
              // this._associateService.setNeedRequestApproved(true);
            } else if (this.data.status === '3') {
              this._associateService.setPreviousViewIndex(2);
              this._associateService.setNeedRequestApplied(true);
              // this._associateService.setNeedRequestRejected(true);
            } else {
              this._associateService.setPreviousViewIndex(0);
            }

          } else {
            alert(`Reset failed!`);
            this.resetDisabled = false;
          }
        }, (error) => {
          alert(`failed!`);
          this.resetDisabled = false;
        });
      } else {
        this.resetDisabled = false;
      }
    });
  }


  onTextChange(args: EventData) {
    const tv = args.object as TextView;
    this.textArea = tv.text;
  }

}
