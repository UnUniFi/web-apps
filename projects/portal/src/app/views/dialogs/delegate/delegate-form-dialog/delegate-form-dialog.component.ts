import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { StakingDelegatorValidators200ResponseValidatorsInner } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet, WalletType } from 'projects/portal/src/app/models/wallets/wallet.model';

export type DelegateOnSubmitEvent = {
  walletType: WalletType;
  amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  validatorList: StakingDelegatorValidators200ResponseValidatorsInner[];
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
  validatorsList?: StakingDelegatorValidators200ResponseValidatorsInner[] | null;
  @Input()
  denom?: string | null;
  @Input()
  balance?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  validator?: StakingDelegatorValidators200ResponseValidatorsInner | null;

  @Output()
  appSubmit: EventEmitter<DelegateOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  delegateAmount?: string;
  gasRatio: number;

  constructor(public dialogRef: DialogRef) {
    this.appSubmit = new EventEmitter();
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
      !this.delegateAmount ||
      !this.selectedGasPrice ||
      !this.validatorsList
    ) {
      return;
    }
    // this.selectedAmount.amount = this.selectedAmount.amount?.toString();
    this.appSubmit.emit({
      walletType: this.currentStoredWallet?.type,
      amount: {
        amount: Math.floor(Number(this.delegateAmount) * 1000000).toString(),
        denom: this.denom,
      },
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

  onClickClose() {
    this.dialogRef.close();
  }
}
