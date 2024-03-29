import { DialogRef } from '@angular/cdk/dialog';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { GovV1Proposal200ResponseProposalsInner } from '@cosmos-client/core/esm/openapi';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type VoteOnSubmitEvent = {
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-vote-form-dialog',
  templateUrl: './vote-form-dialog.component.html',
  styleUrls: ['./vote-form-dialog.component.css'],
})
export class VoteFormDialogComponent implements OnInit, OnChanges {
  @Input()
  proposal?: GovV1Proposal200ResponseProposalsInner | null;
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  proposalID?: number | null;

  @Output()
  appSubmitYes: EventEmitter<VoteOnSubmitEvent>;
  @Output()
  appSubmitNoWithVeto: EventEmitter<VoteOnSubmitEvent>;
  @Output()
  appSubmitNo: EventEmitter<VoteOnSubmitEvent>;
  @Output()
  appSubmitAbstain: EventEmitter<VoteOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;

  constructor(public dialogRef: DialogRef) {
    this.appSubmitYes = new EventEmitter();
    this.appSubmitNoWithVeto = new EventEmitter();
    this.appSubmitNo = new EventEmitter();
    this.appSubmitAbstain = new EventEmitter();
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

  onSubmitYes() {
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.appSubmitYes.emit({ minimumGasPrice: this.selectedGasPrice, gasRatio: this.gasRatio });
  }
  onSubmitNoWithVeto() {
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.appSubmitNoWithVeto.emit({
      minimumGasPrice: this.selectedGasPrice,
      gasRatio: this.gasRatio,
    });
  }
  onSubmitNo() {
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.appSubmitNo.emit({ minimumGasPrice: this.selectedGasPrice, gasRatio: this.gasRatio });
  }
  onSubmitAbstain() {
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.appSubmitAbstain.emit({ minimumGasPrice: this.selectedGasPrice, gasRatio: this.gasRatio });
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
