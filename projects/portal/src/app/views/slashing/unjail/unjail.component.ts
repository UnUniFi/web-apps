import { StoredWallet } from '../../../models/wallets/wallet.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'app-view-unjail',
  templateUrl: './unjail.component.html',
  styleUrls: ['./unjail.component.css'],
})
export class UnjailComponent implements OnInit {
  @Input() currentStoredWallet?: StoredWallet | null;
  @Input() delegator_address?: string | null;
  @Input() validator_address?: string | null;
  @Input() minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output() submitUnjail = new EventEmitter<{
    validator_address: string;
    minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  }>();

  minimumGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

  constructor(private readonly snackBar: MatSnackBar) { }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.minimumGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void { }

  async onSubmitUnjail(validator_address: string, minimumGasPriceAmount: string): Promise<void> {
    if (!this.currentStoredWallet) {
      this.snackBar.open('Wallet is not connected! Please connect wallet first.', 'Close');
      return;
    }

    if (this.minimumGasPrice === undefined) {
      this.snackBar.open('Invalid gas fee!', 'Close');
      return;
    }

    this.submitUnjail.emit({
      validator_address,
      minimumGasPrice: {
        denom: this.minimumGasPrice.denom,
        amount: minimumGasPriceAmount,
      },
    });
  }

  onMinimumGasDenomChanged(denom: string): void {
    this.minimumGasPrice = this.minimumGasPrices?.find(
      (minimumGasPrice) => minimumGasPrice.denom === denom,
    );
  }

  onMinimumGasAmountSliderChanged(amount: string): void {
    if (this.minimumGasPrice) {
      this.minimumGasPrice.amount = amount;
    }
  }
}
