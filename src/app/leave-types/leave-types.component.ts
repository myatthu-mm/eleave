import { Component, OnInit } from '@angular/core';
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { RouterExtensions } from "nativescript-angular/router";
import { LeaveType } from '../shared/constants';
@Component({
  selector: 'app-leave-types',
  templateUrl: './leave-types.component.html',
  styleUrls: ['./leave-types.component.scss']
})
export class LeaveTypesComponent implements OnInit {
  private leaveTypes: any[];

  get LeaveTypes(): any[] {
    return this.leaveTypes;
  }

  set LeaveTypes(value) {
    this.leaveTypes = value;
  }

  constructor(private _routerExtensions: RouterExtensions) { }

  ngOnInit() {
    console.log('leave type created***');
    const list = [];
    Object.keys(LeaveType).forEach(item => {
      list.push({ id: item, name: LeaveType[item] });
    });
    this.LeaveTypes = list;
  }

  onItemTap(args: ItemEventData) {
    this._routerExtensions.navigate(['/request'], {
      clearHistory: true,
      queryParams: this.LeaveTypes[args.index],
      animated: true,
      transition: { name: 'slideRight' }
    });
  }

}
