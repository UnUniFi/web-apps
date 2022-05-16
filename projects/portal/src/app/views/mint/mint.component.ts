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
  appClickCollateral: EventEmitter<string>;

  constructor() {
    this.appClickCollateral = new EventEmitter();
  }

  ngOnInit(): void {}

  onClickCollateral(denom: string | null | undefined) {
    if (!denom) {
      return;
    }
    this.appClickCollateral.emit(denom);
  }
}
