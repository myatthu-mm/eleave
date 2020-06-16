import { Component, OnInit } from '@angular/core';
import { LeaveInfoService, LeaveInfo } from '../shared/services/leave-info.service';
import { BackendService } from '../shared/services/backend.service';
import { CalendarSelectionEventData } from 'nativescript-ui-calendar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [BackendService, LeaveInfoService]
})
export class DashboardComponent implements OnInit {
  private _listItems: Array<LeaveInfo>;
  private token: any;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _backendService: BackendService,
    private _leaveInfoService: LeaveInfoService) {
  }

  get myItems(): Array<LeaveInfo> {
    return this._listItems;
  }

  set myItems(value) {
    this._listItems = value;
  }

  ngOnInit() {
    this._activatedRoute.params.subscribe(params => {
      this.token = params;
      console.log('Token:', this.token);

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

    });
  }

  onDateSelected(args: CalendarSelectionEventData) {
    const startDate = args.date.getFullYear() + '-' + ("0" + (1 + Number(args.date.getMonth()))).slice(-2) + "-" + ("0" + args.date.getDate()).slice(-2);
    const endDate = startDate;
    const bodyData = {
      "managerEmployeeId": "008076",
      "leaveStatus": "Applied",
      "startDate": startDate,
      "endDate": endDate,
      "employeeId": ""
    };
    this._backendService.getLeaves(this.token, bodyData).subscribe(response => {
      if (response['status'].code === 200) {
        const list = response['leave_associate_list']; // get array
        this.myItems = this._leaveInfoService.getPrepareLeaveData(list);
      } else if (!response['status'].message) {
        alert("No data");
      } else {
        alert("Error");
      }

    })

  }


}
