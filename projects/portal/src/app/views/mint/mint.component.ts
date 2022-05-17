import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ununifi } from 'ununifi-client';

@Component({
  selector: 'view-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  @Input()
  collateralParams?: ununifi.cdp.ICollateralParam[] | null;
  @Input()
  debtParams?: ununifi.cdp.IDebtParam[] | null;
  @Output()
  appClickCollateral: EventEmitter<ununifi.cdp.ICollateralParam>;
  @Output()
  appClickDebt: EventEmitter<ununifi.cdp.IDebtParam>;

  constructor() {
    this.appClickCollateral = new EventEmitter();
    this.appClickDebt = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickCollateral(param: ununifi.cdp.ICollateralParam) {
    if (!param) {
      return;
    }
    this.appClickCollateral.emit(param);
  }

  onClickDebt(param: ununifi.cdp.IDebtParam) {
    if (!param) {
      return;
    }
    this.appClickDebt.emit(param);
  }
}
