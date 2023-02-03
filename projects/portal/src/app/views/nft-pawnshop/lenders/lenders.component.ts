import { Component, Input, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'view-lenders',
  templateUrl: './lenders.component.html',
  styleUrls: ['./lenders.component.css'],
})
export class LendersComponent implements OnInit {
  @Input()
  balances?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  denoms?: string[] | null;

  depositAmount: number;
  selectedDenom: string;
  interestRate: number;
  datePicker: Date;

  constructor() {
    this.denoms = ['GUU'];
    this.selectedDenom = this.denoms[0];
    this.depositAmount = 0;
    this.interestRate = 1.5;
    let now = new Date();
    now.setMonth(now.getMonth() + 1);
    now.setMinutes(0);
    now.setSeconds(0);
    this.datePicker = now;
  }

  ngOnInit(): void {}
}
