import { Component, OnInit, Input } from '@angular/core';
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { RouterExtensions } from "nativescript-angular/router";
import { History } from '../../shared/models/leave-history.model';
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
    console.log('list created');

  }

  ngOnInit() {
  }

  onItemTap(args: ItemEventData) {
    this.routerExtensions.navigate(['/history-details'], {
      queryParams: this.items[args.index]
    });
  }



}
