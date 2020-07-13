import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'app-comment-modal',
  templateUrl: './comment-modal.component.html',
  styleUrls: ['./comment-modal.component.scss']
})
export class CommentModalComponent implements OnInit {

  constructor(
    private params: ModalDialogParams,
    private _routerExtensions: RouterExtensions,
    private _activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this._routerExtensions.navigate(['approve-comment-modal'], { queryParams: this.params.context.data, relativeTo: this._activeRoute });
  }

  close() {
    this.params.closeCallback();
  }

}
