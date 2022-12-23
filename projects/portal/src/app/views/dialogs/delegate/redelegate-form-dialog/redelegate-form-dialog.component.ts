import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  DelegatorDelegations200Response,
  StakingDelegatorValidators200ResponseValidatorsInner,
} from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
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
export class RedelegateFormDialogComponent implements OnInit {
  @Input()
  validatorsList?: StakingDelegatorValidators200ResponseValidatorsInner[] | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  delegations?: DelegatorDelegations200Response | null;
  @Input()
  delegateAmount?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  coins?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  uguuBalance?: string | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  validator?: StakingDelegatorValidators200ResponseValidatorsInner | null;

  @Output()
  appSubmit: EventEmitter<RedelegateOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  selectedAmount?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  selectedValidator?: StakingDelegatorValidators200ResponseValidatorsInner;
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
    if (!this.selectedValidator || !this.selectedValidator.operator_address) {
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
      destinationValidator: this.selectedValidator.operator_address,
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
