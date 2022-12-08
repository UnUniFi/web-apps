import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { StoredWallet, WalletType } from 'projects/portal/src/app/models/wallets/wallet.model';

export type CreateIncentiveTokenOnSubmitEvent = {
  walletType: WalletType;
  recipient: { address: string; distRate: string }[];
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};
export type IncentiveDist = {
  address: string;
  distRate: number;
};

@Component({
  selector: 'view-create-token-form-dialog',
  templateUrl: './create-token-form-dialog.component.html',
  styleUrls: ['./create-token-form-dialog.component.css'],
})
export class CreateTokenFormDialogComponent implements OnInit {
  @Input()
  currentStoredWallet?: StoredWallet | null;
  @Input()
  coins?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  uguuBalance?: string | null;
  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output()
  appSubmit: EventEmitter<CreateIncentiveTokenOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  availableDenoms?: string[];
  firstRecipient?: IncentiveDist;
  recipients: IncentiveDist[];
  gasRatio: number;

  constructor() {
    this.firstRecipient = { address: '', distRate: 0 };
    this.recipients = [];
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

  onClickAddRecipient() {
    this.recipients.push({ address: '', distRate: 0 });
  }

  onClickDeleteRecipient(index: number) {
    this.recipients.splice(index, 1);
  }

  onSubmit() {
    if (
      !this.firstRecipient ||
      !this.recipients ||
      !this.currentStoredWallet ||
      !this.selectedGasPrice
    ) {
      return;
    }
    const sumDist =
      Math.floor(this.firstRecipient.distRate * 10) / 10 +
      this.recipients.reduce((prev, curr) => prev + Math.floor(curr.distRate * 10) / 10, 0);
    if (sumDist != 100) {
      alert('Please make the total of the percentages 100%');
      return;
    }
    const listRecipients = [this.firstRecipient].concat(this.recipients).map((rec) => {
      return { address: rec.address, distRate: rec.distRate.toFixed(1) };
    });
    this.appSubmit.emit({
      walletType: this.currentStoredWallet?.type,
      recipient: listRecipients,
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
}
