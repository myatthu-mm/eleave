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
  constructor(
    private params: ModalDialogParams,
    private backendService: BackendService,
    private _activatedRoute: ActivatedRoute) {

  }

  ngOnInit() {
    if (this._activatedRoute.snapshot.queryParamMap) {
      this.medium = new Approval();
      this.medium = this._activatedRoute.snapshot.queryParams as Approval;
    }
  }

  onTextChange(args: EventData) {
    const tv = args.object as TextView;
    this.textArea = tv.text;
  }

  onConfirm() {
    const body = { ...this.medium };
    body.approverComment = this.textArea || '-';
    this.backendService.approveLeave(body).subscribe(response => {
      const status = response['status'];
      const statusLabel = body.status === '2' ? 'Approved' : 'Reject';
      if (status.code == 200) {
        alert(`${statusLabel} success!`);
        this.params.closeCallback('success');
      } else {
        alert(`${statusLabel} failed!`);
        this.onClose();
      }
    }, (error) => {
      alert(`failed!`);
      this.onClose()
    });

  }

  onClose() {
    this.params.closeCallback();
  }

}
