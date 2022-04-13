import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { proto } from '@cosmos-client/core';
import { InlineResponse20066Validators } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type DelegateOnSubmitEvent = {
  amount: proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
};

@Component({
  selector: 'view-delegate-validator-dialog',
  templateUrl: './delegate-validator-dialog.component.html',
  styleUrls: ['./delegate-validator-dialog.component.css'],
})
export class DelegateValidatorDialogComponent implements OnInit {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  coins?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  validator?: InlineResponse20066Validators | null;

  @Output()
  appSubmit: EventEmitter<DelegateOnSubmitEvent>;

  selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  selectedAmount?: proto.cosmos.base.v1beta1.ICoin;

  constructor() {
    this.appSubmit = new EventEmitter();
    // this.availableDenoms = this.coins?.map((coin) => coin.denom!);
    this.availableDenoms = ['uguu'];
    if (this.coins) {
      this.selectedAmount = { denom: this.coins[0].denom, amount: '0' };
    }
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void {}

  getColorCode(validator: InlineResponse20066Validators) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(validator.operator_address ?? ''))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }

  onSubmit(minimumGasPrice: string) {
    if (!this.selectedAmount) {
      return;
    }
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.selectedGasPrice.amount = minimumGasPrice.toString();

    this.appSubmit.emit({ amount: this.selectedAmount, minimumGasPrice: this.selectedGasPrice });
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
