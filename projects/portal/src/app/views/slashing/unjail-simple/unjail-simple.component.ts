import { StoredWallet } from '../../../models/wallets/wallet.model';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { proto } from '@cosmos-client/core';

@Component({
  selector: 'app-view-unjail-simple',
  templateUrl: './unjail-simple.component.html',
  styleUrls: ['./unjail-simple.component.css'],
})
export class UnjailSimpleComponent implements OnInit {
  @Input() currentStoredWallet?: StoredWallet | null;
  @Input() delegator_address?: string | null;
  @Input() validator_address?: string | null;
  @Input() minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output() submitUnjail = new EventEmitter<{
    validator_address: string;
    minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
    privateKey: string;
  }>();

  @ViewChild('fileInputRef') fileInputRef?: ElementRef;

  minimumGasPrice?: proto.cosmos.base.v1beta1.ICoin;
  file: File | null;
  jsonString: string | null;
  privateWallet:
    | (StoredWallet & {
        privateKey: string;
      })
    | null;

  constructor(private readonly snackBar: MatSnackBar) {
    this.file = null;
    this.jsonString = null;
    this.privateWallet = null;
  }

  ngOnChanges(): void {
    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.minimumGasPrice = this.minimumGasPrices[0];
    }
  }

  ngOnInit(): void {}

  async onChangeFile($event: Event): Promise<void> {
    console.log('onChangeFile');
    if ($event === null || $event.target === null) {
      return;
    }
    const target = $event.target as HTMLInputElement;
    const files = target.files;
    if (files === null || files.length === 0) {
      return;
    }
    this.file = files[0];
    this.jsonString = await this.file.text();
    console.log(this.jsonString);
    this.privateWallet = JSON.parse(this.jsonString);
    console.log(this.privateWallet);
    if (!this.privateWallet?.privateKey) {
      this.snackBar.open(
        `Error: PrivateKey does not contained! Need to drag and drop correct wallet backup file!`,
      );
      return;
    }
    if (this.privateWallet?.address && this.privateWallet?.address !== this.delegator_address) {
      this.snackBar.open(`Error: Uploaded account info and node settings are mismatch!`);
      return;
    }
    console.log(this.minimumGasPrice?.amount);
    if (!this.minimumGasPrice?.amount) {
      this.snackBar.open(`Error: minimumGasPrice.amount is invalid!`);
      return;
    }
    console.log(this.delegator_address);
    if (!this.delegator_address) {
      this.snackBar.open(`Error: delegator_address is invalid!`);
      return;
    }
    console.log(this.validator_address);
    if (!this.validator_address) {
      this.snackBar.open(`Error: validator_address is invalid!`);
      return;
    }
    this.onSubmitUnjail(
      this.validator_address,
      this.minimumGasPrice?.amount,
      this.privateWallet.privateKey,
    );
  }

  onSubmitUnjail(
    validator_address: string,
    minimumGasPriceAmount: string,
    privateKey: string,
  ): void {
    if (!this.currentStoredWallet) {
      this.snackBar.open('Wallet is not connected! Please connect wallet first.', 'Close');
      return;
    }

    if (this.minimumGasPrice === undefined) {
      this.snackBar.open('Invalid gas fee!');
      return;
    }

    console.log('submitUnjail');

    this.submitUnjail.emit({
      validator_address,
      minimumGasPrice: {
        denom: this.minimumGasPrice.denom,
        amount: minimumGasPriceAmount,
      },
      privateKey,
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
