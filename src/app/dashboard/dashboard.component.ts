import { Component, OnInit, EventEmitter, Output, HostListener } from '@angular/core';
import { LeaveService, LeaveInfo, Country } from '../shared/services/leave.service';
import { BackendService } from '../shared/services/backend.service';
import { CalendarSelectionEventData } from 'nativescript-ui-calendar';
import { ActivatedRoute } from '@angular/router';
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { ObservableArray } from 'tns-core-modules/data/observable-array';
import { RouterExtensions } from "nativescript-angular/router";
import { LeaveItem } from '../shared/models/leave-item.model';
import { Page } from "tns-core-modules/ui/page";
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [BackendService, LeaveService]
})
export class DashboardComponent implements OnInit {
  private _listItems: Array<LeaveItem>;
  private token: any;
  private _pieSource: ObservableArray<Country>;
  constructor(
    private _activatedRoute: ActivatedRoute,
    private _routerExtension: RouterExtensions,
    private _backendService: BackendService,
    private _leaveInfoService: LeaveService,
    private _page: Page) {
  }

  get items(): Array<LeaveItem> {
    return this._listItems;
  }

  set items(value) {
    this._listItems = value;
  }

  get pieSource(): ObservableArray<Country> {
    return this._pieSource;
  }


  @HostListener('loaded')
  pageOnInit() {
    console.log('Dashboard created................');
    this._page.actionBarHidden = true;
    this._pieSource = new ObservableArray(this._leaveInfoService.getCategoricalSource());
    this._listItems = [
      { date: "Sep 10, 2019 - Sep 13, 2019", type: "Annual leave (AL) 3 day(s)", status: "rejected" },
      { date: "Aug 6, 2019 - Aug 7, 2019", type: "Annual leave (AL) 3 day(s)", status: "pending" },
      { date: "July 31, 2019 - July 31, 2019", type: "Cascual leave (CL) 1 day(s)", status: "approved" },
    ]
  }

  ngOnInit() {
    // this._activatedRoute.params.subscribe(params => {
    //   this.token = params;

    // const today = new Date();
    // const currentDate = today.getFullYear() + '-' + ("0" + (today.getMonth() + 1)).slice(-2) + '-' + ("0" + today.getDate()).slice(-2);
    // const bodyData = {
    //   "managerEmployeeId": "008076",
    //   "leaveStatus": "Applied",
    //   "startDate": currentDate,
    //   "endDate": currentDate,
    //   "employeeId": ""
    // };
    // this._backendService.getLeaves(this.token, bodyData).subscribe(response => {
    //   if (response['status'].code === 200) {
    //     const list = response['leave_associate_list']; // get array
    //     this.myItems = this._leaveInfoService.getPrepareLeaveData(list);
    //   } else if (!response['status'].message) {
    //     alert("No data");
    //   } else {
    //     alert("Error");
    //   }

    // })

    // });
  }

  onItemTap(args: ItemEventData) {
    console.log(`Index: ${args.index}; View: ${args.view} ; Item: ${this._listItems[args.index]}`);
  }


  templateSelector(item: Item) {
    if (item.status == 'rejected') return 'rejected'
    return "approved";
  }

  // onDateSelected(args: CalendarSelectionEventData) {
  //   const startDate = args.date.getFullYear() + '-' + ("0" + (1 + Number(args.date.getMonth()))).slice(-2) + "-" + ("0" + args.date.getDate()).slice(-2);
  //   const endDate = startDate;
  //   const bodyData = {
  //     "managerEmployeeId": "008076",
  //     "leaveStatus": "Applied",
  //     "startDate": startDate,
  //     "endDate": endDate,
  //     "employeeId": ""
  //   };
  //   this._backendService.getLeaves(this.token, bodyData).subscribe(response => {
  //     if (response['status'].code === 200) {
  //       const list = response['leave_associate_list']; // get array
  //       this.myItems = this._leaveInfoService.getPrepareLeaveData(list);
  //     } else if (!response['status'].message) {
  //       alert("No data");
  //     } else {
  //       alert("Error");
  //     }

  //   })

  // }


}

class Item {
  constructor(public id: number, public date: string, public type: string, public status: string) { }
}