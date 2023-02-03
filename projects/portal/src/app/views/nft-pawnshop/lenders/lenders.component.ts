import { Component, Input, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { ListedClass200Response } from 'ununifi-client/esm/openapi';

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
  @Input()
  listedClasses?: ListedClass200Response[] | null;
  @Input()
  classImages?: string[] | null;

  depositAmount: number;
  selectedDenom: string;
  interestRate: number;
  datePicker: Date;
  isSubmitted: boolean;

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
    this.isSubmitted = false;
  }

  ngOnInit(): void {}

  onSubmit() {
    // todo output & change NFT classes
    this.isSubmitted = true;
  }

  onClickClass(classID?: string) {
    if (!classID) {
      alert('No classID');
    }
    // todo open nfts in the class
  }
}
