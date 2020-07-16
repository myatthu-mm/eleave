import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { RouterExtensions } from "nativescript-angular/router";
import { isIOS } from "tns-core-modules/platform";
import { ListView } from "tns-core-modules/ui/list-view";
import { History } from '../../shared/models/history.model';
import { Store } from '@ngxs/store';
import { RequestHistoryList } from '../../shared/states/history/history.actions';
import { LeaveService } from '../../shared/services/leave.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-leave-listview',
  templateUrl: './leave-listview.component.html',
  styleUrls: ['./leave-listview.component.scss']
})
export class LeaveListviewComponent implements OnInit, OnDestroy {
  @Input() items: History[];
  unsubscribe$: Subject<boolean> = new Subject();
  constructor(
    private routerExtensions: RouterExtensions,
    private store: Store,
    private leaveService: LeaveService
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onLoaded(lst: ListView) {
    if (lst.ios) {
      lst.ios.showsVerticalScrollIndicator = false;
    } else {
      lst.android.setVerticalScrollBarEnabled(false);
    }
  }

  onItemTap(args: ItemEventData) {
    this.routerExtensions.navigate(['/history-details'], {
      queryParams: this.items[args.index],
      animated: true,
      transition: { name: isIOS ? 'curl' : 'flip', duration: isIOS ? 650 : 300 }
    });
  }

  refreshList(args) {
    this.leaveService.setPullingStrategy_Obs(true);
    const pullRefresh = args.object;
    this.store.dispatch(new RequestHistoryList());
    this.leaveService.getPullingStrategy_Obs().pipe(takeUntil(this.unsubscribe$)).subscribe(flag => {
      if (!flag) {
        pullRefresh.refreshing = false;
      }
    });
  }

}
