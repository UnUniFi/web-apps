import { Component, Input, OnInit } from '@angular/core';
import { ununifi } from 'ununifi-client';

@Component({
  selector: 'view-debt-param',
  templateUrl: './debt-param.component.html',
  styleUrls: ['./debt-param.component.css'],
})
export class DebtParamComponent implements OnInit {
  @Input()
  type?: string | null;
  @Input()
  debtParam?: ununifi.cdp.IDebtParam | null;

  constructor() {}

  ngOnInit(): void {}
}
