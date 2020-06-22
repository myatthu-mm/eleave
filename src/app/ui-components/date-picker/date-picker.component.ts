import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements OnInit {

  constructor(
    private params: ModalDialogParams,
    private router: RouterExtensions,
    private _activeRoute: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  public onClose() {
    this.params.closeCallback('success');
  }

}
