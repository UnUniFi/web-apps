import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20041Validators } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet, WalletType } from 'projects/portal/src/app/models/wallets/wallet.model';

export type CreateIncentiveTokenOnSubmitEvent = {
  walletType: WalletType;
  recipient: { address: string; dist_rate: string }[];
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-create-token-form-dialog',
  templateUrl: './create-token-form-dialog.component.html',
  styleUrls: ['./create-token-form-dialog.component.css'],
})
export class CreateTokenFormDialogComponent implements OnInit {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  coins?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  uguuBalance?: string | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output()
  appSubmit: EventEmitter<CreateIncentiveTokenOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  selectedRecipients?: { address: string; dist_rate: string }[];
  gasRatio: number;

  constructor() {
    this.appSubmit = new EventEmitter();
    // this.availableDenoms = this.coins?.map((coin) => coin.denom!);
    this.availableDenoms = ['uguu'];

    this.gasRatio = 0;
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void {}

  changeGasRatio(ratio: number) {
    this.gasRatio = ratio;
  }

  onSubmit() {
    if (!this.selectedRecipients || !this.currentStoredWallet || !this.selectedGasPrice) {
      return;
    }
    this.appSubmit.emit({
      walletType: this.currentStoredWallet?.type,
      recipient: this.selectedRecipients,
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
