import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { History } from '../../shared/models/leave-history.model';
@Component({
  selector: 'app-leave-history-details',
  templateUrl: './leave-history-details.component.html',
  styleUrls: ['./leave-history-details.component.scss']
})
export class LeaveHistoryDetailsComponent implements OnInit {

  history: History;
  leaveType: string;
  status: string;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _routerExtensions: RouterExtensions
  ) { }

  ngOnInit() {
    if (this._activatedRoute.snapshot.queryParamMap) {
      this.history = this._activatedRoute.snapshot.queryParams as History;
      this.leaveType = this.history['type'] + ` (${this.history.leave_type_code})`;
      this.status = this.history.leave_status[0].toUpperCase() + this.history.leave_status.slice(1) + ` by ${this.history.approver_name}`
    }
  }

  goBack() {
    this._routerExtensions.back();
  }


}
