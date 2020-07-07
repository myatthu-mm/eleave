import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SegmentedBar, SegmentedBarItem, SelectedIndexChangedEventData } from "tns-core-modules/ui/segmented-bar";

@Component({
  selector: 'app-leave-approval',
  templateUrl: './leave-approval.component.html',
  styleUrls: ['./leave-approval.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveApprovalComponent implements OnInit {

  tabTitles: string[] = ['Processing', 'Approved', 'Rejected'];
  mySegmentedBarItems: Array<SegmentedBarItem> = [];
  items: any[] = [
    { name: 'mt', message: 'developer' },
    { name: 'knt', message: 'senior developer' },
    { name: 'wph', message: 'fullstack' },
    { name: 'yhh', message: 'senior' },
    { name: 'amh', message: 'developer' },
  ];
  constructor() {
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

  onSwipeCellStarted(args) {
    const swipeLimits = args.data.swipeLimits;
    const swipeView = args.object;
    const rightItem = swipeView.getViewById('delete-view');
    swipeLimits.left = 0;
    swipeLimits.right = rightItem.getMeasuredWidth();
  }

  ngOnInit() {
  }

}
