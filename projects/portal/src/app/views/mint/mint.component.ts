import { Component, Input, OnInit } from '@angular/core';
import ununifi from 'ununifi-client';

@Component({
  selector: 'view-mint',
  templateUrl: './mint.component.html',
  styleUrls: ['./mint.component.css'],
})
export class MintComponent implements OnInit {
  @Input()
  collateralParams?: ununifi.proto.ununifi.cdp.ICollateralParam[] | null;
  @Input()
  debtParams?: ununifi.proto.ununifi.cdp.IDebtParam[] | null;
  constructor() {}

  ngOnInit(): void {}
}
