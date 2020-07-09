import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { ActivatedRoute } from '@angular/router';
import { EventData } from 'tns-core-modules/ui/page';
import { TextView } from 'tns-core-modules/ui/text-view';
@Component({
  selector: 'app-approve-comment-modal',
  templateUrl: './approve-comment-modal.component.html',
  styleUrls: ['./approve-comment-modal.component.scss']
})
export class ApproveCommentModalComponent implements OnInit {
  info: any;
  textArea = "";
  constructor(
    private params: ModalDialogParams,
    private _activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    if (this._activatedRoute.snapshot.queryParamMap) {
      this.info = this._activatedRoute.snapshot.queryParams;
    }
  }

  onTextChange(args: EventData) {
    const tv = args.object as TextView;
    this.textArea = tv.text;
  }

  onConfirm() {
    this.params.closeCallback(this.textArea || '-');
  }

  onClose() {
    this.params.closeCallback();
  }

}
