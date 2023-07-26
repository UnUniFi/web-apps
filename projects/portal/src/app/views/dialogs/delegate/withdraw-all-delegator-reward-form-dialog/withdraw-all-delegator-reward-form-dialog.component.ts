import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  DelegatorDelegations200ResponseDelegationResponsesInner,
  StakingDelegatorValidators200ResponseValidatorsInner,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type WithdrawAllDelegatorRewardOnSubmitEvent = {
  validators: string[];
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-withdraw-all-delegator-reward-form-dialog',
  templateUrl: './withdraw-all-delegator-reward-form-dialog.component.html',
  styleUrls: ['./withdraw-all-delegator-reward-form-dialog.component.css'],
})
export class WithdrawAllDelegatorRewardFormDialogComponent implements OnInit, OnChanges {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  validator?: StakingDelegatorValidators200ResponseValidatorsInner | null;
  @Input()
  delegations?: DelegatorDelegations200ResponseDelegationResponsesInner[] | null;
  @Input()
  delegatedValidators?: (StakingDelegatorValidators200ResponseValidatorsInner | undefined)[] | null;

  @Output()
  appSubmit: EventEmitter<WithdrawAllDelegatorRewardOnSubmitEvent>;

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

  toNumber(str: string) {
    return Number(str);
  }

  onSubmit() {
    if (this.selectedGasPrice === undefined) {
      return;
    }
    if (!this.delegatedValidators) {
      return;
    }
    const validatorAddresses = this.delegatedValidators
      .map((validator) => validator?.operator_address)
      .filter((validator): validator is string => typeof validator == 'string');
    this.appSubmit.emit({
      validators: validatorAddresses,
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
