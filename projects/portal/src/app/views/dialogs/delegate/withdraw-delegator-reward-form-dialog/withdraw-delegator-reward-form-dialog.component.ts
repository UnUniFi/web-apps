import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { StakingDelegatorValidators200ResponseValidatorsInner } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type WithdrawDelegatorRewardOnSubmitEvent = {
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-withdraw-delegator-reward-form-dialog',
  templateUrl: './withdraw-delegator-reward-form-dialog.component.html',
  styleUrls: ['./withdraw-delegator-reward-form-dialog.component.css'],
})
export class WithdrawDelegatorRewardFormDialogComponent implements OnInit, OnChanges {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  validator?: StakingDelegatorValidators200ResponseValidatorsInner | null;

  @Output()
  appSubmit: EventEmitter<WithdrawDelegatorRewardOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
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
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.appSubmit.emit({
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

  onClickClose() {
    this.dialogRef.close();
  }
}
