import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { SegmentedBar, SegmentedBarItem, SelectedIndexChangedEventData } from "tns-core-modules/ui/segmented-bar";
import { ListViewEventData } from "nativescript-ui-listview";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";
import { Subject, Subscription } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { ListView } from "tns-core-modules/ui/list-view";
import { getString } from "tns-core-modules/application-settings";
import { ModalComponent } from '../ui-components/modal/modal.component';
import { AssociateService } from '../shared/states/associate/associate.service';
import { Associate } from '../shared/models/associate.model';
import { BackendService } from '../shared/services/backend.service';
import { LeaveService } from '../shared/services/leave.service';
import { Approval } from '../shared/models/approval.model';
@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LeaveApprovalComponent implements OnInit, OnDestroy {

  private appliedLeaves: Array<Associate>;
  private approvedLeaves: Array<Associate>;
  private rejectedLeaves: Array<Associate>;

  private appliedSourceSubscription: Subscription;
  private approvedSourceSubscription: Subscription;
  private rejectedSourceSubscription: Subscription;

  startDate_Applied: DateModel;
  endDate_Applied: DateModel;
  startDate_Approved: DateModel;
  endDate_Approved: DateModel;
  startDate_Rejected: DateModel;
  endDate_Rejected: DateModel;

  processing: boolean;
  selectedSegmentedIndex: number;

  tabTitles: string[] = ['Processing', 'Approved', 'Rejected'];
  appliedVisibility: boolean;
  approvedVisibility: boolean;
  rejectedVisibility: boolean;
  appliedEmpty: boolean;
  approvedEmpty: boolean;
  rejectedEmpty: boolean;
  mySegmentedBarItems: Array<SegmentedBarItem> = [];
  private _unsubscribe$ = new Subject();
  constructor(
    private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private routerExtension: RouterExtensions,
    private associateService: AssociateService,
    private backendService: BackendService,
    private leaveService: LeaveService
  ) {
    this.tabTitles.forEach(tab => {
      const item = new SegmentedBarItem();
      item.title = tab;
      this.mySegmentedBarItems.push(item);
    });
  }

  get AppliedLeaves(): Array<Associate> {
    return this.appliedLeaves;
  }

  set AppliedLeaves(value) {
    this.appliedLeaves = value;
  }

  get ApprovedLeaves(): Array<Associate> {
    return this.approvedLeaves;
  }

  set ApprovedLeaves(value) {
    this.approvedLeaves = value;
  }

  get RejectedLeaves(): Array<Associate> {
    return this.rejectedLeaves;
  }

  set RejectedLeaves(value) {
    this.rejectedLeaves = value;
  }

  public onSelectedIndexChange(args: SelectedIndexChangedEventData) {
    const segmentedBar = args.object as SegmentedBar;
    this.setVisibility(segmentedBar.selectedIndex);
    this.selectedSegmentedIndex = segmentedBar.selectedIndex;
    switch (segmentedBar.selectedIndex) {
      case 0: this.callToAppliedLeaves(); break;
      case 1: this.callToApprovedLeaves(); break;
      case 2: this.callToRejectedLeaves(); break;
    }
  }

  public onSwipeClick(args, _status: string) {
    const swipedIndex = this.AppliedLeaves.indexOf(args.object.bindingContext);
    const swipedItem = this.AppliedLeaves[swipedIndex];

    let approval = new Approval();
    approval.userId = getString('userId');
    approval.employeeId = swipedItem.employee_id;
    approval.leaveTypeCode = swipedItem.leave_type_code;
    const startDate = this.changeDateFormat(new Date(swipedItem.leave_start_date));
    const endDate = this.changeDateFormat(new Date(swipedItem.leave_end_date));
    approval.startDate = startDate;
    approval.endDate = endDate;
    approval.half = swipedItem.half_type;
    approval.duration = swipedItem.duration;
    approval.updatedBy = getString('userId');
    approval.updatedDate = this.changeDateFormat(new Date());
    approval.remarks = swipedItem.remark;
    approval.unit = getString('unit');
    approval.status = _status === 'approved' ? '2' : '3'; // 2 - approved, 3 - rejected status
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: { page: 'approval', data: approval }
    };
    this.modalService.showModal(ModalComponent, options).then(result => {
      if (result) {
        this.AppliedLeaves.splice(swipedIndex, 1);
        this.associateService.requestAppliedLeaves();
        if (_status == 'approved') {
          this.associateService.setNeedRequestApproved(true);
        } else {
          this.associateService.setNeedRequestRejected(true);
        }
      } else {
        console.log('nothing');
      }
    });
  }

  public onLoaded(lst: ListView) {
    if (lst.ios) {
      lst.ios.collectionView.showsVerticalScrollIndicator = false;
    } else {
      lst.android.setVerticalScrollBarEnabled(false);
    }
  }

  public itemClick(_item) {
    this.routerExtension.navigate(['/approval-details'], {
      queryParams: _item,
      animated: true,
      transition: { name: 'slideTop' }
    });
  }

  public listenRemoveEvent_Applied($startEvent) {
    if ($startEvent) {
      this.startDate_Applied = new DateModel();
      if (this.endDate_Applied.value) {
        this.callToAppliedLeavesWithDate(this.endDate_Applied.value, this.endDate_Applied.value);
        return;
      }
    } else {
      this.endDate_Applied = new DateModel();
      if (this.startDate_Applied.value) {
        this.callToAppliedLeavesWithDate(this.startDate_Applied.value, this.startDate_Applied.value);
        return;
      }
    }
    this.callToAppliedLeaves();
  }

  public listenRemoveEvent_Approved($startEvent) {
    if ($startEvent) {
      this.startDate_Approved = new DateModel();
      if (this.endDate_Approved.value) {
        this.callToApprovedLeavesWithDate(this.endDate_Approved.value, this.endDate_Approved.value);
        return;
      }
    } else {
      this.endDate_Approved = new DateModel();
      if (this.startDate_Approved.value) {
        this.callToApprovedLeavesWithDate(this.startDate_Approved.value, this.startDate_Approved.value);
        return;
      }
    }
    this.callToApprovedLeaves();
  }

  public listenRemoveEvent_Rejected($startEvent) {
    if ($startEvent) {
      this.startDate_Rejected = new DateModel();
      if (this.endDate_Rejected.value) {
        this.callToRejectedLeavesWithDate(this.endDate_Rejected.value, this.endDate_Rejected.value);
        return;
      }
    } else {
      this.endDate_Rejected = new DateModel();
      if (this.startDate_Rejected.value) {
        this.callToRejectedLeavesWithDate(this.startDate_Rejected.value, this.startDate_Rejected.value);
        return;
      }
    }
    this.callToRejectedLeaves();
  }

  public onSwipeCellStarted(args: ListViewEventData) {
    const swipeLimits = args.data.swipeLimits;
    swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.2; // 20% of whole width
    swipeLimits.right = args['mainView'].getMeasuredWidth() * 0.45; // 35% of whole width
    swipeLimits.left = 0;
  }

  public onResetSwipeCellStarted(args: ListViewEventData) {
    const swipeLimits = args.data.swipeLimits;
    swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.2; // 20% of whole width
    swipeLimits.right = args['mainView'].getMeasuredWidth() * 0.25; // 25% of whole width
    swipeLimits.left = 0;
  }

  public onFilter() {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: { page: 'approval-filter' }
    };
    this.modalService.showModal(ModalComponent, options).then((result: any) => {
      if (result) {
        switch (this.selectedSegmentedIndex) {
          case 0: this.setDateApplied(result); break;
          case 1: this.setDateApproved(result); break;
          case 2: this.setDateRejected(result); break;
        }
      } else {
        console.log('nothing');
      }
    });
  }

  private setVisibility(_index) {
    this.appliedVisibility = false;
    this.approvedVisibility = false;
    this.rejectedVisibility = false;
    switch (_index) {
      case 0: this.appliedVisibility = true; break;
      case 1: this.approvedVisibility = true; break;
      case 2: this.rejectedVisibility = true; break;
    }
  }

  private callToAppliedLeaves() {
    this.processing = true;
    this.closeSubscription(this.approvedSourceSubscription);
    this.closeSubscription(this.rejectedSourceSubscription);
    this.appliedSourceSubscription = this.associateService.appliedLeaves
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value.length) {
          this.AppliedLeaves = value;
          this.processing = false;
        } else {
          this.associateService.requestAppliedLeaves();
        }
      }, (error) => this.processing = false);
  }

  private callToAppliedLeavesWithDate(_startDate: string, _endDate: string) {
    this.processing = true;
    this.appliedEmpty = true;
    this.backendService.getAssociateLeave('Applied', _startDate, _endDate)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(response => {
        const status = response['status'];
        if (status.code === 200) {
          this.AppliedLeaves = this.leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
          this.processing = false;
        } else {
          this.AppliedLeaves = [];
          this.appliedEmpty = true;
          this.processing = false;
        }
      }, (error) => {
        alert('error');
        console.error('Error response:', error);
        this.processing = false;
      })
  }

  private callToApprovedLeaves() {
    this.processing = true;
    this.associateService.getNeedtoRequestApproved()
      .pipe(take(1))
      .subscribe(flag => {
        console.log('Flag:', flag);
      });
    this.closeSubscription(this.appliedSourceSubscription);
    this.closeSubscription(this.rejectedSourceSubscription);
    console.log('approve subscribe');
    this.approvedSourceSubscription = this.associateService.approvedLeaves
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value.length) {
          this.ApprovedLeaves = value;
          this.processing = false;
        } else {
          this.associateService.requestApprovedLeaves();
        }
      }, (error) => this.processing = false);
  }

  private callToApprovedLeavesWithDate(_startDate: string, _endDate: string) {
    this.processing = true;
    this.approvedEmpty = true;
    this.backendService.getAssociateLeave('Approved', _startDate, _endDate)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(response => {
        const status = response['status'];
        if (status.code === 200) {
          this.ApprovedLeaves = this.leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
          this.processing = false;
        } else {
          this.ApprovedLeaves = [];
          this.approvedEmpty = true;
          this.processing = false;
        }
      }, (error) => {
        alert('error');
        console.error('Error response:', error);
        this.processing = false;
      })
  }

  private callToRejectedLeaves() {
    this.processing = true;
    this.closeSubscription(this.appliedSourceSubscription);
    this.closeSubscription(this.approvedSourceSubscription);
    this.rejectedSourceSubscription = this.associateService.rejectedLeaves
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(value => {
        if (value.length) {
          this.RejectedLeaves = value;
          this.processing = false;
        } else {
          this.associateService.requestRejectedLeaves();
        }
      }, (error) => this.processing = false);
  }

  private callToRejectedLeavesWithDate(_startDate: string, _endDate: string) {
    this.processing = true;
    this.rejectedEmpty = true;
    this.backendService.getAssociateLeave('Rejected', _startDate, _endDate)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(response => {
        const status = response['status'];
        if (status.code === 200) {
          this.RejectedLeaves = this.leaveService.getFormattedLeaveRequests(response['leave_associate_list']);
          this.processing = false;
        } else {
          this.RejectedLeaves = [];
          this.rejectedEmpty = true;
          this.processing = false;
        }
      }, (error) => {
        alert('error');
        console.error('Error response:', error);
        this.processing = false;
      })
  }



  private setDateApplied(_date: any) {
    this.startDate_Applied.value = _date.startValue;
    this.startDate_Applied.label = _date.startLabel;
    this.endDate_Applied.value = _date.endValue;
    this.endDate_Applied.label = _date.endLabel;
    this.callToAppliedLeavesWithDate(this.startDate_Applied.value, this.endDate_Applied.value);
  }

  private setDateApproved(_date: any) {
    this.startDate_Approved.value = _date.startValue;
    this.startDate_Approved.label = _date.startLabel;
    this.endDate_Approved.value = _date.endValue;
    this.endDate_Approved.label = _date.endLabel;
    this.callToApprovedLeavesWithDate(this.startDate_Approved.value, this.endDate_Approved.value);
  }

  private setDateRejected(_date: any) {
    this.startDate_Rejected.value = _date.startValue;
    this.startDate_Rejected.label = _date.startLabel;
    this.endDate_Rejected.value = _date.endValue;
    this.endDate_Rejected.label = _date.endLabel;
    this.callToAppliedLeavesWithDate(this.startDate_Rejected.value, this.endDate_Rejected.value);
  }

  private changeDateFormat(_date: Date) {
    const year = _date.getFullYear();
    const month = ('0' + (_date.getMonth() + 1)).slice(-2);
    const date = ('0' + _date.getDate()).slice(-2);
    return `${year}-${month}-${date}`;
  }

  private closeSubscription(subObj$: Subscription) {
    if (subObj$) {
      subObj$.unsubscribe();
    }
  }

  ngOnInit() {
    console.log('leave approval preloading...');
    this.startDate_Applied = new DateModel();
    this.endDate_Applied = new DateModel();
    this.startDate_Approved = new DateModel();
    this.endDate_Approved = new DateModel();
    this.startDate_Rejected = new DateModel();
    this.endDate_Rejected = new DateModel();
    this.associateService.getNeedtoRequestApplied().pipe(takeUntil(this._unsubscribe$)).subscribe(flag => flag);
    this.associateService.getNeedtoRequestApproved().pipe(takeUntil(this._unsubscribe$)).subscribe(flag => flag);
    this.associateService.getNeedtoRequestRejected().pipe(takeUntil(this._unsubscribe$)).subscribe(flag => flag);
  }

  ngOnDestroy() {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
    this._unsubscribe$.unsubscribe();
  }

}

class DateModel {
  label: string;
  value: string;
}