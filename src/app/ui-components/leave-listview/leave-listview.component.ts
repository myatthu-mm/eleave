import { Component, OnInit, Input } from '@angular/core';
import { ItemEventData } from "tns-core-modules/ui/list-view";
import { RouterExtensions } from "nativescript-angular/router";
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

  onItemTap(args: ItemEventData) {
    this.routerExtensions.navigate(['/history-details'], {
      queryParams: this.items[args.index],
      animated: true,
      transition: { name: 'fade' }
    });
  }



}
