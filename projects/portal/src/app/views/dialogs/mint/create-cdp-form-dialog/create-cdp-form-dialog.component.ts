import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { proto } from '@cosmos-client/core';
import { InlineResponse20066Validators } from '@cosmos-client/core/esm/openapi';
import { WalletType, StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { DelegateOnSubmitEvent } from '../../delegate/delegate-form-dialog/delegate-form-dialog.component';

export type CreateCdpOnSubmitEvent = {
  walletType: WalletType;
  amount: proto.cosmos.base.v1beta1.ICoin;
  minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
  gasRatio: number;
};

@Component({
  selector: 'view-create-cdp-form-dialog',
  templateUrl: './create-cdp-form-dialog.component.html',
  styleUrls: ['./create-cdp-form-dialog.component.css'],
})
export class CreateCdpFormDialogComponent implements OnInit {
    @Input()
    currentStoredWallet?: StoredWallet | null;
    @Input()
    collaterialBalance?: string | null;
    @Input()
    coins?: proto.cosmos.base.v1beta1.ICoin[] | null;
    @Input()
    minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;

    @Output()
    appSubmit: EventEmitter<DelegateOnSubmitEvent>;

    selectedGasPrice?: proto.cosmos.base.v1beta1.ICoin;
    availableDenoms?: string[];
    selectedAmount?: proto.cosmos.base.v1beta1.ICoin;
    gasRatio: number;

    constructor() {
      this.appSubmit = new EventEmitter();
      // this.availableDenoms = this.coins?.map((coin) => coin.denom!);
      this.selectedAmount = { denom: 'uguu', amount: '0' };
      this.gasRatio = 1.1;
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
      if (
        !this.currentStoredWallet ||
        !this.selectedAmount ||
        !this.selectedGasPrice ||

      ) {
        return;
      }
      this.selectedAmount.amount = this.selectedAmount.amount?.toString();
      this.appSubmit.emit({
        walletType: this.currentStoredWallet?.type,
        amount: this.selectedAmount,
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

  constructor() {}

  ngOnInit(): void {}
}
