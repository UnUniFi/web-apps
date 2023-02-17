import { StoredWallet } from '../../../models/wallets/wallet.model';
import { BidderNftsInfo } from '../../../pages/nft-pawnshop/lenders/lenders.component';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { ListedClass200Response } from 'ununifi-client/esm/openapi';

export interface LendParams {
  classID: string;
  deposit: { amount: number; symbol: string };
  interestRate: number;
  repaymentTerm: Date;
}

@Component({
  selector: 'view-lenders',
  templateUrl: './lenders.component.html',
  styleUrls: ['./lenders.component.css'],
})
export class LendersComponent implements OnInit {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  balances?: { [symbol: string]: number } | null;
  @Input()
  depositCoins?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  lendCoins?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  biddingNftsInfo?: BidderNftsInfo | null;
  @Input()
  denoms?: string[] | null;
  @Input()
  listedClasses?: ListedClass200Response[] | null;
  @Input()
  classImages?: string[] | null;
  @Output()
  appSubmit: EventEmitter<string>;
  @Output()
  appViewClass: EventEmitter<LendParams>;

  depositAmount: number;
  selectedDenom: string;
  interestRate: number;
  datePicker: Date;
  isSubmitted: boolean;

  constructor() {
    this.appSubmit = new EventEmitter();
    this.appViewClass = new EventEmitter();
    this.denoms = ['axlUSDC', 'ATOM', 'GUU'];
    this.selectedDenom = this.denoms[2];
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
    this.isSubmitted = true;
    this.appSubmit.emit(this.selectedDenom);
  }

  onChangeSymbol() {
    this.isSubmitted = false;
  }

  onClickClass(classID?: string) {
    if (!classID) {
      alert('No classID');
      return;
    }
    this.appViewClass.emit({
      classID,
      deposit: { amount: this.depositAmount, symbol: this.selectedDenom },
      interestRate: this.interestRate,
      repaymentTerm: this.datePicker,
    });
  }
}
