import { Component, OnInit, OnDestroy } from '@angular/core';
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { RouterExtensions } from "nativescript-angular/router";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LeaveService } from '../shared/services/leave.service';
import { LeaveType } from '../shared/constants';
@Component({
  selector: 'app-leave-types',
  templateUrl: './leave-types.component.html',
  styleUrls: ['./leave-types.component.scss']
})
export class LeaveTypesComponent implements OnInit, OnDestroy {
  private leaveTypes: any[];
  unsubscribe$: Subject<boolean> = new Subject();

  get LeaveTypes(): any[] {
    return this.leaveTypes;
  }

  set LeaveTypes(value) {
    this.leaveTypes = value;
  }

  constructor(
    private _routerExtensions: RouterExtensions,
    private _leaveServie: LeaveService) { }

  ngOnInit() {
    console.log('leave type created***');

    const list = [];
    Object.keys(LeaveType).forEach(item => {
      list.push({ id: item, name: LeaveType[item] });
    });
    this.LeaveTypes = list;
    this._leaveServie.getLeaveTypeObs().pipe(takeUntil(this.unsubscribe$)).subscribe(data => data);
  }

  ngOnDestroy() {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }

  onItemTap(args: ItemEventData) {
    this._leaveServie.setLeaveTypeObs(this.LeaveTypes[args.index]);
    this._routerExtensions.back();
  }

}
