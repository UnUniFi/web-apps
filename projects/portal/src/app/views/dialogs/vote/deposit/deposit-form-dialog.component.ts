import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Proposals200ResponseProposalsInner } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type DepositOnSubmitEvent = {
  amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-deposit-form-dialog',
  templateUrl: './deposit-form-dialog.component.html',
  styleUrls: ['./deposit-form-dialog.component.css'],
})
export class DepositFormDialogComponent implements OnInit, OnChanges {
  @Input()
  proposal?: Proposals200ResponseProposalsInner | null;
  @Input()
  proposalContent?: cosmosclient.proto.cosmos.gov.v1beta1.TextProposal | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  denom?: string | null;
  @Input()
  balance?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  proposalID?: number | null;

  @Output()
  appSubmit: EventEmitter<DepositOnSubmitEvent>;

  depositAmount?: number;
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
    if (!this.depositAmount) {
      return;
    }
    if (!this.denom) {
      return;
    }
    if (this.selectedGasPrice === undefined) {
      return;
    }
    const exponent = getDenomExponent(this.denom);
    this.appSubmit.emit({
      amount: {
        amount: Math.floor(Number(this.depositAmount) * 10 ** exponent).toString(),
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
