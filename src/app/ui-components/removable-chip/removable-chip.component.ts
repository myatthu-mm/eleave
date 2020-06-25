import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-removable-chip',
  templateUrl: './removable-chip.component.html',
  styleUrls: ['./removable-chip.component.scss']
})
export class RemovableChipComponent implements OnInit {

  @Input()
  label: String;

  @Input()
  isStart: Boolean;

  @Output()
  removeEvent: EventEmitter<Boolean> = new EventEmitter<Boolean>();

  constructor() { }

  ngOnInit() {
  }

  removed() {
    this.removeEvent.emit(this.isStart);
  }

}
