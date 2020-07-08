import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewContainerRef } from '@angular/core';
import { SegmentedBar, SegmentedBarItem, SelectedIndexChangedEventData } from "tns-core-modules/ui/segmented-bar";
import { ListViewEventData } from "nativescript-ui-listview";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { RouterExtensions } from "nativescript-angular/router";
import { isIOS } from "tns-core-modules/platform";
import { ModalComponent } from '../ui-components/modal/modal.component';


@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveApprovalComponent implements OnInit, OnDestroy {

  startDate: DateModel;
  endDate: DateModel;
  processing: boolean;
  isEmpty: boolean;
  tabTitles: string[] = ['Processing', 'Approved', 'Rejected'];
  mySegmentedBarItems: Array<SegmentedBarItem> = [];
  items: any[] = [
    { name: 'mt', message: 'developer' },
    { name: 'knt', message: 'senior developer' },
    { name: 'wph', message: 'fullstack' },
    { name: 'yhh', message: 'senior' },
    { name: 'amh', message: 'developer' },
  ];
  constructor(
    private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef,
    private routerExtension: RouterExtensions,
  ) {
    this.tabTitles.forEach(tab => {
      const item = new SegmentedBarItem();
      item.title = tab;
      this.mySegmentedBarItems.push(item);
    });
  }

  public onSelectedIndexChange(args: SelectedIndexChangedEventData) {
    const segmentedBar = args.object as SegmentedBar;
    console.log(segmentedBar.selectedIndex);
  }

  public itemClick(_item) {
    console.log(_item);
    this.routerExtension.navigate(['/approval-details'], {
      queryParams: _item,
      animated: true,
      transition: { name: isIOS ? 'curl' : 'fade' }
    });
  }

  public onApproveSwipeClick(args: ListViewEventData) {
    console.log("Left swipe click");
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: { page: 'leave-approval' }
    };
    this.modalService.showModal(ModalComponent, options).then((result: any) => {
      if (result) {
        console.log(result);

      } else {
        console.log('nothing');
      }
    });
  }

  public onFilter() {
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: { page: 'approval-filter' }
    };
    this.modalService.showModal(ModalComponent, options).then((result: any) => {
      if (result) {
        this.startDate.value = result.startValue;
        this.startDate.label = result.startLabel;
        this.endDate.value = result.endValue;
        this.endDate.label = result.endLabel;
        // this.callToLeaveHistoryWithDate(this.startDate.value, this.endDate.value);
      } else {
        console.log('nothing');
      }
    });
  }

  public onRejectSwipeClick(args) {
    console.log("Right swipe click");
  }

  public onSwipeCellStarted(args: ListViewEventData) {
    const swipeLimits = args.data.swipeLimits;
    swipeLimits.threshold = args['mainView'].getMeasuredWidth() * 0.5; // 20% of whole width
    swipeLimits.right = args['mainView'].getMeasuredWidth() * 0.45; // 35% of whole width
    swipeLimits.left = 0;
  }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}

class DateModel {
  label: string;
  value: string;
}