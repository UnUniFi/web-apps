import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { proto } from '@cosmos-client/core';
import {
  InlineResponse20038,
  InlineResponse20047,
  InlineResponse20041Validators,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type UndelegateOnSubmitEvent = {
  amount: proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-undelegate-form-dialog',
  templateUrl: './undelegate-form-dialog.component.html',
  styleUrls: ['./undelegate-form-dialog.component.css'],
})
export class UndelegateFormDialogComponent implements OnInit {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  delegations?: InlineResponse20038 | null;
  @Input()
  delegateAmount?: proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  coins?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  uguuBalance?: string | null;
  @Input()
  minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  unbondingDelegation?: InlineResponse20047 | null;
  @Input()
  validator?: InlineResponse20041Validators | null;

  @Output()
  appSubmit: EventEmitter<UndelegateOnSubmitEvent>;

  selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  selectedAmount?: proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;

  estimatedUnbondingData: string = '';
  now = new Date();

  constructor() {
    this.appSubmit = new EventEmitter();
    // this.availableDenoms = this.coins?.map((coin) => coin.denom!);
    this.availableDenoms = ['uguu'];
    this.selectedAmount = { denom: 'uguu', amount: '0' };
    this.gasRatio = 0;
    this.now.setDate(this.now.getDate() + 14);
    this.estimatedUnbondingData = this.now.toString();
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void {}

  getColorCode(address: string) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(address ?? ''))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }

  changeGasRatio(ratio: number) {
    this.gasRatio = ratio;
  }

  onSubmit(minimumGasPrice: string) {
    if (!this.selectedAmount) {
      return;
    }
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.selectedAmount.amount = this.selectedAmount.amount?.toString();
    this.appSubmit.emit({
      amount: this.selectedAmount,
      minimumGasPrice: this.selectedGasPrice,
      gasRatio: this.gasRatio,
    });
  }

  onMinimumGasDenomChanged(denom: string): void {
    this.selectedGasPrice = this.minimumGasPrices?.find(
      (minimumGasPrice) => minimumGasPrice.denom === denom,
    );
  }

  onMinimumGasAmountSliderChanged(amount: string): void {
    if (this.selectedGasPrice) {
      this.selectedGasPrice.amount = amount;
    }
  }
}
