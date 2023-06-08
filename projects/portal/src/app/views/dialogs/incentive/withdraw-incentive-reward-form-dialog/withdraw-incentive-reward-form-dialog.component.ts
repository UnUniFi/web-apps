import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type WithdrawRewardOnSubmitEvent = {
  denom: string;
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-withdraw-incentive-reward-form-dialog',
  templateUrl: './withdraw-incentive-reward-form-dialog.component.html',
  styleUrls: ['./withdraw-incentive-reward-form-dialog.component.css'],
})
export class WithdrawIncentiveRewardFormDialogComponent implements OnInit {
  @Input()
  denom?: string;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  reward?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;

  @Output()
  appSubmit: EventEmitter<WithdrawRewardOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  gasRatio: number;

  constructor(public dialogRef: DialogRef) {
    this.appSubmit = new EventEmitter();
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
    if (!this.denom || !this.currentStoredWallet || !this.selectedGasPrice) {
      return;
    }
    this.appSubmit.emit({
      denom: this.denom,
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
