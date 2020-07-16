import { Component, OnInit, Input } from '@angular/core';
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { RouterExtensions } from "nativescript-angular/router";
import { isIOS } from "tns-core-modules/platform";
import { ListView } from "tns-core-modules/ui/list-view";
import { History } from '../../shared/models/history.model';
@Component({
  selector: 'app-leave-listview',
  templateUrl: './leave-listview.component.html',
  styleUrls: ['./leave-listview.component.scss']
})
export class LeaveListviewComponent implements OnInit {
  @Input() items: History[];
  constructor(
    private routerExtensions: RouterExtensions,
  ) {
  }

  ngOnInit() {
    console.log('list preloading.....');
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
      transition: { name: isIOS ? 'curl' : 'explode', duration: 650 }
    });
  }



}
