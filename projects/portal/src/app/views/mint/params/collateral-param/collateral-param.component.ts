import { Component, Input, OnInit } from '@angular/core';
import { ununifi } from 'ununifi-client';

@Component({
  selector: 'view-collateral-param',
  templateUrl: './collateral-param.component.html',
  styleUrls: ['./collateral-param.component.css'],
})
export class CollateralParamComponent implements OnInit {
  @Input()
  type?: string | null;
  @Input()
  collateralParam?: ununifi.cdp.ICollateralParam | null;

  constructor() {}

  ngOnInit(): void {}
}
