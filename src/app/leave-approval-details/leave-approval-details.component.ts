import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterExtensions } from "nativescript-angular/router";
import { Page } from "tns-core-modules/ui/page";
@Component({
  selector: 'app-leave-approval-details',
  templateUrl: './leave-approval-details.component.html',
  styleUrls: ['./leave-approval-details.component.scss']
})
export class LeaveApprovalDetailsComponent implements OnInit {
  data: any;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _routerExtensions: RouterExtensions,
    private _page: Page
  ) { }

  ngOnInit() {
    if (this._activatedRoute.snapshot.queryParamMap) {
      this.data = this._activatedRoute.snapshot.queryParams;
      console.log(this.data);

    }
  }

}
