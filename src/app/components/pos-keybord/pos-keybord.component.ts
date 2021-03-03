import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pos-keybord',
  templateUrl: './pos-keybord.component.html',
  styleUrls: ['./pos-keybord.component.scss'],
})
export class PosKeybordComponent implements OnInit {
  @Output() enterKeys : EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {}
  onKeyPress(event) {
    this.enterKeys.emit(event);
  }
}
