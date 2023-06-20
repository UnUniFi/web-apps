import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  DelegatorDelegations200Response,
  UnbondingDelegation200Response,
  StakingDelegatorValidators200ResponseValidatorsInner,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { denomExponentMap } from 'projects/portal/src/app/models/cosmos/bank.model';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type UndelegateOnSubmitEvent = {
  amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-undelegate-form-dialog',
  templateUrl: './undelegate-form-dialog.component.html',
  styleUrls: ['./undelegate-form-dialog.component.css'],
})
export class UndelegateFormDialogComponent implements OnInit, OnChanges {
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
  unbondingDelegation?: UnbondingDelegation200Response | null;
  @Input()
  validator?: StakingDelegatorValidators200ResponseValidatorsInner | null;

  @Output()
  appSubmit: EventEmitter<UndelegateOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  undelegateAmount?: number;
  gasRatio: number;

  estimatedUnbondingData: string = '';
  now = new Date();

  constructor(public dialogRef: DialogRef) {
    this.appSubmit = new EventEmitter();
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

  onSubmit() {
    if (!this.undelegateAmount) {
      return;
    }
    if (!this.denom) {
      return;
    }
    if (this.selectedGasPrice === undefined) {
      return;
    }
    const exponent = denomExponentMap[this.denom];
    this.appSubmit.emit({
      amount: {
        amount: Math.floor(Number(this.undelegateAmount) * 10 ** exponent).toString(),
        denom: this.denom,
      },
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
