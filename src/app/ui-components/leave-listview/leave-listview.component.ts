import { Component, OnInit, Input } from '@angular/core';
import { LeaveItem } from '../../shared/models/leave-item.model';
@Component({
  selector: 'app-leave-listview',
  templateUrl: './leave-listview.component.html',
  styleUrls: ['./leave-listview.component.scss']
})
export class LeaveListviewComponent implements OnInit {
  @Input() items: LeaveItem[];
  constructor() {
    console.log('list created');

  }

  ngOnInit() {
  }

}
