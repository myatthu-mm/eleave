import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { ActivatedRoute } from '@angular/router';
import { EventData } from 'tns-core-modules/ui/page';
import { TextView } from 'tns-core-modules/ui/text-view';
import { Approval } from '../../shared/models/approval.model';
import { BackendService } from '../../shared/services/backend.service';
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
    private _activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.queryParamMap) {
      this.medium = new Approval();
      this.medium = this._activatedRoute.snapshot.queryParams as Approval;
      this.status = this.medium.status === '2' ? 'Approved' : 'Reject';
    }
  }

  onTextChange(args: EventData) {
    const tv = args.object as TextView;
    this.textArea = tv.text;
  }

  onConfirm() {
    const bodyPayload = { ...this.medium };
    bodyPayload.approverComment = this.textArea || '-';
    this.backendService.approveMockLeave(bodyPayload).subscribe(response => {
      const status = response['status'];
      const statusLabel = this.status;
      if (status.code == 200) {
        alert(`${statusLabel} success!`);
        this.params.closeCallback('success');
      } else {
        alert(`${statusLabel} failed!`);
        this.onClose();
      }
    }, (error) => {
      alert(`failed!`);
      this.onClose();
    });

  }

  onClose() {
    this.params.closeCallback();
  }

}
