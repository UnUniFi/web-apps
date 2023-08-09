import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  DelegatorDelegations200Response,
  StakingDelegatorValidators200ResponseValidatorsInner,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type RedelegateOnSubmitEvent = {
  destinationValidator: string;
  amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  validatorList: StakingDelegatorValidators200ResponseValidatorsInner[];
  gasRatio: number;
};

@Component({
  selector: 'view-redelegate-form-dialog',
  templateUrl: './redelegate-form-dialog.component.html',
  styleUrls: ['./redelegate-form-dialog.component.css'],
})
export class RedelegateFormDialogComponent implements OnInit, OnChanges {
  @Input()
  validatorsList?: StakingDelegatorValidators200ResponseValidatorsInner[] | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  delegations?: DelegatorDelegations200Response | null;
  @Input()
  delegateCoin?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  denom?: string | null;
  @Input()
  balance?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  validator?: StakingDelegatorValidators200ResponseValidatorsInner | null;

  @Output()
  appSubmit: EventEmitter<RedelegateOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  redelegateAmount?: number;
  selectedValidator?: string;
  gasRatio: number;

  constructor(public dialogRef: DialogRef) {
    this.appSubmit = new EventEmitter();
    this.gasRatio = 0;
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
    if (this.validatorsList) {
      this.selectedValidator = this.validatorsList.filter(
        (val) => val.operator_address != this.validator?.operator_address,
      )[0].operator_address;
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
    if (!this.selectedValidator) {
      alert('Please select a validator');
      return;
    }
    if (!this.redelegateAmount) {
      alert('Please input amount');
      return;
    }
    if (!this.selectedGasPrice) {
      alert('Please select gas price');
      return;
    }
    if (!this.validatorsList) {
      alert('invalid Validators List');
      return;
    }
    if (!this.denom) {
      alert('invalid denom');
      return;
    }
    const exponent = getDenomExponent(this.denom);
    this.appSubmit.emit({
      destinationValidator: this.selectedValidator,
      amount: {
        amount: Math.floor(Number(this.redelegateAmount) * 10 ** exponent).toString(),
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
