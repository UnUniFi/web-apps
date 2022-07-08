import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

export type SendOnSubmitEvent = {
  currentStoredWallet: StoredWallet;
  toAddress: string;
  amount: cosmosclient.proto.cosmos.base.v1beta1.ICoin[];
  minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  coins: cosmosclient.proto.cosmos.base.v1beta1.ICoin[];
};

@Component({
  selector: 'view-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  @Input()
  currentStoredWallet?: StoredWallet | null;

  @Input()
  coins?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Input()
  amount?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Input()
  minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output()
  appSubmit: EventEmitter<SendOnSubmitEvent>;

  selectedGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

  constructor() {
    this.appSubmit = new EventEmitter();
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.selectedGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void { }

  onSubmit(toAddress: string, minimumGasPrice: string) {
    if (!this.currentStoredWallet) {
      return;
    }
    if (!this.amount) {
      return;
    }
    if (this.selectedGasPrice === undefined) {
      return;
    }
    this.selectedGasPrice.amount = minimumGasPrice.toString();

    this.appSubmit.emit({
      currentStoredWallet: this.currentStoredWallet,
      toAddress,
      amount: this.amount
        .filter((coin) => {
          return Number(coin.amount) > 0;
        })
        .map((coin) => ({
          denom: coin.denom,
          amount: coin.amount?.toString(),
        })),
      minimumGasPrice: this.selectedGasPrice,
      coins: this.coins!,
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
