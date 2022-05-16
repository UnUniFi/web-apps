import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'view-collateral-menu-dialog',
  templateUrl: './collateral-menu-dialog.component.html',
  styleUrls: ['./collateral-menu-dialog.component.css'],
})
export class CollateralMenuDialogComponent implements OnInit {
  @Input()
  denom?: string | null;

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
    if (!this.denom) {
      return;
    }
    this.appCreate.emit(this.denom);
  }

  onClickDetailButton() {
    if (!this.denom) {
      return;
    }
    this.appDetail.emit(this.denom);
  }
}
