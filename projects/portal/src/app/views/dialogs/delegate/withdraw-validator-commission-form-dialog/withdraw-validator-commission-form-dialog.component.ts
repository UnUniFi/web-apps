import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  DelegatorDelegations200Response,
  StakingDelegatorValidators200ResponseValidatorsInner,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type WithdrawValidatorCommissionOnSubmitEvent = {
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-withdraw-validator-commission-form-dialog',
  templateUrl: './withdraw-validator-commission-form-dialog.component.html',
  styleUrls: ['./withdraw-validator-commission-form-dialog.component.css'],
})
export class WithdrawValidatorCommissionFormDialogComponent implements OnInit, OnChanges {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  validator?: StakingDelegatorValidators200ResponseValidatorsInner | null;

  @Output()
  appSubmit: EventEmitter<WithdrawValidatorCommissionOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
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
