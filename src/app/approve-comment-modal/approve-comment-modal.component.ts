import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';

@Component({
  selector: 'app-approve-comment-modal',
  templateUrl: './approve-comment-modal.component.html',
  styleUrls: ['./approve-comment-modal.component.scss']
})
export class ApproveCommentModalComponent implements OnInit {

  constructor(private params: ModalDialogParams) { }

  ngOnInit() {
  }

  onConfirm() {

  }

  onClose() {
    this.params.closeCallback();
  }

}
