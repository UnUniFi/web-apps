import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'view-collateral-menu-dialog',
  templateUrl: './collateral-menu-dialog.component.html',
  styleUrls: ['./collateral-menu-dialog.component.css'],
})
export class CollateralMenuDialogComponent implements OnInit {
  @Input()
  type?: string | null;

  @Output()
  appCreate: EventEmitter<string>;
  @Output()
  appDetail: EventEmitter<string>;

  constructor() {
    this.appCreate = new EventEmitter();
    this.appDetail = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickCreateButton() {
    if (!this.type) {
      return;
    }
    this.appCreate.emit(this.type);
  }

  onClickDetailButton() {
    if (!this.type) {
      return;
    }
    this.appDetail.emit(this.type);
  }
}
