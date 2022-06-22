import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { proto } from '@cosmos-client/core';
import {
  InlineResponse20038,
  InlineResponse20014Validators,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type RedelegateOnSubmitEvent = {
  destinationValidator: string;
  amount: proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  validatorList: InlineResponse20014Validators[];
  gasRatio: number;
};

@Component({
  selector: 'view-redelegate-form-dialog',
  templateUrl: './redelegate-form-dialog.component.html',
  styleUrls: ['./redelegate-form-dialog.component.css'],
})
export class RedelegateFormDialogComponent implements OnInit {
  @Input()
  validatorsList?: InlineResponse20014Validators[] | null;
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
  validator?: InlineResponse20014Validators | null;

  @Output()
  appSubmit: EventEmitter<RedelegateOnSubmitEvent>;

  selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  selectedAmount?: proto.cosmos.base.v1beta1.ICoin;
  selectedValidator?: InlineResponse20014Validators;
  gasRatio: number;

  constructor() {
    this.appSubmit = new EventEmitter();
    this.availableDenoms = ['uguu'];
    this.gasRatio = 0;
  }

  ngOnChanges(): void {
    this.selectedAmount = { denom: 'uguu', amount: '0' };
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
    if (this.validatorsList) {
      this.selectedValidator = this.validatorsList[0];
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
    if (!this.selectedValidator || !this.selectedValidator.address) {
      return;
    }
    if (!this.selectedAmount) {
      return;
    }
    if (!this.selectedGasPrice) {
      return;
    }
    if (!this.validatorsList) {
      return;
    }
    this.selectedAmount.amount = this.selectedAmount.amount?.toString();
    this.appSubmit.emit({
      destinationValidator: this.selectedValidator.address,
      amount: this.selectedAmount,
      minimumGasPrice: this.selectedGasPrice,
      validatorList: this.validatorsList,
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
