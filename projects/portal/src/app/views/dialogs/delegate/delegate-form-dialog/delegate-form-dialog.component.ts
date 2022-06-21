import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { proto } from '@cosmos-client/core';
import { InlineResponse20014Validators } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet, WalletType } from 'projects/portal/src/app/models/wallets/wallet.model';

export type DelegateOnSubmitEvent = {
  walletType: WalletType;
  amount: proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  validatorList: InlineResponse20014Validators[];
  gasRatio: number;
};

@Component({
  selector: 'view-delegate-form-dialog',
  templateUrl: './delegate-form-dialog.component.html',
  styleUrls: ['./delegate-form-dialog.component.css'],
})
export class DelegateFormDialogComponent implements OnInit {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  validatorsList?: InlineResponse20014Validators[] | null;
  @Input()
  coins?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  uguuBalance?: string | null;
  @Input()
  minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  validator?: InlineResponse20014Validators | null;

  @Output()
  appSubmit: EventEmitter<DelegateOnSubmitEvent>;

  selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  selectedAmount?: proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;

  constructor() {
    this.appSubmit = new EventEmitter();
    // this.availableDenoms = this.coins?.map((coin) => coin.denom!);
    this.availableDenoms = ['uguu'];

    this.selectedAmount = { denom: 'uguu', amount: '0' };
    this.gasRatio = 0;
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

  onSubmit() {
    if (
      !this.currentStoredWallet ||
      !this.selectedAmount ||
      !this.selectedGasPrice ||
      !this.validatorsList
    ) {
      return;
    }
    this.selectedAmount.amount = this.selectedAmount.amount?.toString();
    this.appSubmit.emit({
      walletType: this.currentStoredWallet?.type,
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
