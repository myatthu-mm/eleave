import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { ActivatedRoute } from '@angular/router';
import { EventData } from 'tns-core-modules/ui/page';
import { TextView } from 'tns-core-modules/ui/text-view';
import { Page } from "tns-core-modules/ui/page";
import { TNSFancyAlert } from "nativescript-fancyalert";
import { Approval } from '../../shared/models/approval.model';
import { BackendService } from '../../shared/services/backend.service';
import { LeaveStatus } from '../../shared/constants';
import { AlertService } from '../../shared/services/alert.service';
@Component({
  selector: 'app-approve-comment-modal',
  templateUrl: './approve-comment-modal.component.html',
  styleUrls: ['./approve-comment-modal.component.scss']
})
export class ApproveCommentModalComponent implements OnInit {
  medium: Approval;
  textArea = "";
  status: string = '';
  constructor(
    private params: ModalDialogParams,
    private backendService: BackendService,
    private _activatedRoute: ActivatedRoute,
    private _alertService: AlertService,
    private _page: Page) {

  }

  ngOnInit() {
    this._page.actionBarHidden = true;
    if (this._activatedRoute.snapshot.queryParamMap) {
      this.medium = new Approval();
      this.medium = this._activatedRoute.snapshot.queryParams as Approval;
      this.status = this.medium.status === '2' ? LeaveStatus.Approved : LeaveStatus.Rejected;
    }
  }

  onTextChange(args: EventData) {
    const tv = args.object as TextView;
    this.textArea = tv.text;
  }

  onConfirm() {
    const bodyPayload = { ...this.medium };
    bodyPayload.approverComment = this.textArea || '-';
    this.backendService.approveLeave(bodyPayload).subscribe(response => {
      const status = response['status'];
      const statusLabel = this.status;
      if (status.code == 200) {
        this._alertService.showSuccess(`${statusLabel} status`)
        this.params.closeCallback('success');
      } else {
        this._alertService.showError(`${statusLabel} status`);
        this.onClose();
      }
    }, (error) => {
      this._alertService.showServerError();
      this.onClose();
    });

  }

  onClose() {
    this.params.closeCallback();
  }

}
