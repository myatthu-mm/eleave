import { Component, OnInit, HostListener, ViewContainerRef } from '@angular/core';
import { LeaveItem } from '../shared/models/leave-item.model';
import { LeaveService } from '../shared/services/leave.service';
import { Page } from "tns-core-modules/ui/page";
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ModalComponent } from '../ui-components/modal/modal.component';
import { MonthName } from '../shared/constants';
@Component({
  selector: 'app-leave-history',
  templateUrl: './leave-history.component.html',
  styleUrls: ['./leave-history.component.scss'],
  providers: [LeaveService]
})
export class LeaveHistoryComponent implements OnInit {
  private _leaveItems: Array<LeaveItem>;
  startDate_label: string;
  endDate_label: string;
  constructor(
    private _leaveService: LeaveService,
    private _page: Page,
    private modalService: ModalDialogService,
    private viewContainerRef: ViewContainerRef) {
    this.startDate_label = '';
    this.endDate_label = '';
  }

  get items(): Array<LeaveItem> {
    return this._leaveItems;
  }

  set items(value) {
    this._leaveItems = value;
  }

  @HostListener('loaded')
  pageOnInit() {
    console.log('Leave history created................');
    this._page.actionBarHidden = false;
    this.items = this._leaveService.getLeaveHistories();

  }


  ngOnInit() {
    console.log('leave history preloading...');
  }

  onFilter() {
    console.log('filter start');
    const options: ModalDialogOptions = {
      viewContainerRef: this.viewContainerRef,
      fullscreen: false,
      context: {}
    };
    this.modalService.showModal(ModalComponent, options).then((result: any) => {
      if (result && result.length > 1) {
        const startDate_str = result.split('&')[0];
        const endDate_str = result.split('&')[1];
        this.startDate_label = this.getDateLabel(startDate_str);
        this.endDate_label = this.getDateLabel(endDate_str);
        console.log(result);
      } else {
        console.log('nothing');
      }
    });
  }

  listenRemoveEvent($startEvent) {
    if ($startEvent) {
      this.startDate_label = '';
    } else {
      this.endDate_label = '';
    }
  }

  private getDateLabel(_dateStr) {
    return `${MonthName[Number(_dateStr.split('-')[1])]} ${_dateStr.split('-')[2]}, ${_dateStr.split('-')[0]}`;
  }


}
