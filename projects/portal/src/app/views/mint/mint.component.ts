import { Component, Input, OnInit } from '@angular/core';
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

  // Todo: should add global parameter (not debt / not collateral)
  @Input()
  params?: ununifi.cdp.IParams | null;

  constructor() {}

  ngOnInit(): void {}
}
