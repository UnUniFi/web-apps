import { EditValidatorData } from '../../../models/cosmos/staking.model';
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
  selector: 'view-edit-validator-simple',
  templateUrl: './edit-validator-simple.component.html',
  styleUrls: ['./edit-validator-simple.component.css'],
})
export class ViewEditValidatorSimpleComponent implements OnInit {
  @Input() currentStoredWallet?: StoredWallet | null;
  @Input() moniker?: string | null;
  @Input() identity?: string | null;
  @Input() website?: string | null;
  @Input() security_contact?: string | null;
  @Input() details?: string | null;
  @Input() rate?: string | null;
  @Input() min_self_delegation?: string | null;
  @Input() delegator_address?: string | null;
  @Input() validator_address?: string | null;
  @Input() denom?: string | null;
  @Input() amount?: string | null;
  @Input() pubkey?: string | null;
  @Input() minimumGasPrices?: proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output() submitEditValidator = new EventEmitter<
    EditValidatorData & {
      minimumGasPrice: proto.cosmos.base.v1beta1.ICoin;
      privateKey: string;
    }
  >();

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
    this.privateWallet = JSON.parse(this.jsonString);
    if (!this.privateWallet?.privateKey) {
      this.snackBar.open(
        `Error: PrivateKey does not contained! Need to drag and drop correct wallet backup file!`,
        'Close',
      );
      return;
    }
    if (this.privateWallet?.address && this.privateWallet?.address !== this.delegator_address) {
      this.snackBar.open(`Error: Uploaded account info and node settings are mismatch!`, 'Close');
      return;
    }
    if (!this.minimumGasPrice?.amount) {
      this.snackBar.open(`Error: minimumGasPrice.amount is invalid!`, 'Close');
      return;
    }
    if (!this.moniker) {
      this.snackBar.open(`Error: moniker is invalid!`, 'Close');
      return;
    }
    if (!this.identity) {
      this.snackBar.open(`Error: identity is invalid!`, 'Close');
      return;
    }
    if (!this.website) {
      this.website = '';
    }
    if (!this.security_contact) {
      this.security_contact = '';
    }
    if (!this.details) {
      this.details = '';
    }
    if (!this.rate) {
      this.snackBar.open(`Error: rate is invalid!`, 'Close');
      return;
    }
    if (!this.min_self_delegation) {
      this.snackBar.open(`Error: min_self_delegation is invalid!`, 'Close');
      return;
    }
    if (!this.delegator_address) {
      this.snackBar.open(`Error: delegator_address is invalid!`, 'Close');
      return;
    }
    if (!this.validator_address) {
      this.snackBar.open(`Error: validator_address is invalid!`, 'Close');
      return;
    }
    if (!this.denom) {
      this.snackBar.open(`Error: denom is invalid!`, 'Close');
      return;
    }
    if (!this.amount) {
      this.snackBar.open(`Error: amount is invalid!`, 'Close');
      return;
    }
    await this.onSubmitEditValidator(
      this.moniker,
      this.identity,
      this.website,
      this.security_contact,
      this.details,
      this.rate,

      this.min_self_delegation,
      this.delegator_address,
      this.validator_address,
      this.denom,
      this.amount,

      //this.pubkey,
      this.minimumGasPrice?.amount,
      this.privateWallet.privateKey,
    );
  }

  async onSubmitEditValidator(
    moniker: string,
    identity: string,
    website: string,
    security_contact: string,
    details: string,
    rate: string,
    min_self_delegation: string,
    delegator_address: string,
    validator_address: string,
    denom: string,
    amount: string,
    minimumGasPriceAmount: string,
    privateKey: string,
  ): Promise<void> {
    if (!this.currentStoredWallet) {
      this.snackBar.open('Wallet is not connected! Please connect wallet first.', 'Close');
      return;
    }

    if (this.minimumGasPrice === undefined) {
      this.snackBar.open('Invalid gas fee!', 'Close');
      return;
    }
    this.submitEditValidator.emit({
      moniker,
      identity,
      website,
      security_contact,
      details,
      rate,
      min_self_delegation,
      delegator_address,
      validator_address,
      denom,
      amount,
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
