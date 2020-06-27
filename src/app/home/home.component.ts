import { Component, OnInit } from '@angular/core';
import { Page } from "tns-core-modules/ui/page";
import { BottomNavigation } from "tns-core-modules/ui/bottom-navigation/bottom-navigation";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'E-leave';
  bottomNavigation: BottomNavigation;
  constructor(private _page: Page) {
  }

  ngOnInit() {
    this._page.actionBarHidden = true;
    this.bottomNavigation = this._page.getViewById('ButtonNav');
  }

  onLoaded(index) {
    console.log(`Tab ${index} loaded`);
  }

  listenHistoryEvent($event) {
    // this.historyTab.notify({ eventName: 'tap', object: this.historyTab })
    this.bottomNavigation.selectedIndex = 2;
  }

}

