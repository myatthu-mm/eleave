import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from "nativescript-angular/modal-dialog";
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';


@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  constructor(
    private params: ModalDialogParams,
    private _routerExtensions: RouterExtensions,
    private _activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this._routerExtensions.navigate(['filter-modal'], { relativeTo: this._activeRoute });
  }

  close() {
    this.params.closeCallback();
  }

}
