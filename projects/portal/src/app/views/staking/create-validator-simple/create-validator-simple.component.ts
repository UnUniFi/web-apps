import { CreateValidatorData } from '../../../models/cosmos/staking.model';
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
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'app-view-create-validator-simple',
  templateUrl: './create-validator-simple.component.html',
  styleUrls: ['./create-validator-simple.component.css'],
})
export class CreateValidatorSimpleComponent implements OnInit {
  @Input() currentStoredWallet?: StoredWallet | null;
  @Input() moniker?: string | null;
  @Input() identity?: string | null;
  @Input() website?: string | null;
  @Input() security_contact?: string | null;
  @Input() details?: string | null;
  @Input() rate?: string | null;
  @Input() max_rate?: string | null;
  @Input() max_change_rate?: string | null;
  @Input() min_self_delegation?: string | null;
  @Input() delegator_address?: string | null;
  @Input() validator_address?: string | null;
  @Input() denom?: string | null;
  @Input() amount?: string | null;
  @Input() ip?: string | null;
  @Input() node_id?: string | null;
  @Input() pubkey?: string | null;
  @Input() minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output() submitCreateValidator = new EventEmitter<
    CreateValidatorData & {
      minimumGasPrice: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
      privateKey: string;
    }
  >();

  @ViewChild('fileInputRef') fileInputRef?: ElementRef;

  minimumGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
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

  ngOnInit(): void { }

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
      );
      return;
    }
    if (this.privateWallet?.address && this.privateWallet?.address !== this.delegator_address) {
      this.snackBar.open(`Error: Uploaded account info and node settings are mismatch!`);
      return;
    }
    if (!this.minimumGasPrice?.amount) {
      this.snackBar.open(`Error: minimumGasPrice.amount is invalid!`);
      return;
    }
    if (!this.moniker) {
      this.snackBar.open(`Error: moniker is invalid!`);
      return;
    }
    if (!this.identity) {
      this.snackBar.open(`Error: identity is invalid!`);
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
      this.snackBar.open(`Error: rate is invalid!`);
      return;
    }
    if (!this.max_rate) {
      this.snackBar.open(`Error: max_rate is invalid!`);
      return;
    }
    if (!this.max_change_rate) {
      this.snackBar.open(`Error: max_change_rate is invalid!`);
      return;
    }
    if (!this.min_self_delegation) {
      this.snackBar.open(`Error: min_self_delegation is invalid!`);
      return;
    }
    if (!this.delegator_address) {
      this.snackBar.open(`Error: delegator_address is invalid!`);
      return;
    }
    if (!this.validator_address) {
      this.snackBar.open(`Error: validator_address is invalid!`);
      return;
    }
    if (!this.denom) {
      this.snackBar.open(`Error: denom is invalid!`);
      return;
    }
    if (!this.amount) {
      this.snackBar.open(`Error: amount is invalid!`);
      return;
    }
    if (!this.ip) {
      this.snackBar.open(`Error: ip is invalid!`);
      return;
    }
    if (!this.node_id) {
      this.snackBar.open(`Error: node_id is invalid!`);
      return;
    }
    if (!this.pubkey) {
      this.snackBar.open(`Error: pubkey is invalid!`);
      return;
    }
    await this.onSubmitCreateValidator(
      this.moniker,
      this.identity,
      this.website,
      this.security_contact,
      this.details,
      this.rate,
      this.max_rate,
      this.max_change_rate,
      this.min_self_delegation,
      this.delegator_address,
      this.validator_address,
      this.denom,
      this.amount,
      this.ip,
      this.node_id,
      this.pubkey,
      this.minimumGasPrice?.amount,
      this.privateWallet.privateKey,
    );
  }

  async onSubmitCreateValidator(
    moniker: string,
    identity: string,
    website: string,
    security_contact: string,
    details: string,
    rate: string,
    max_rate: string,
    max_change_rate: string,
    min_self_delegation: string,
    delegator_address: string,
    validator_address: string,
    denom: string,
    amount: string,
    ip: string,
    node_id: string,
    pubkey: string,
    minimumGasPriceAmount: string,
    privateKey: string,
  ): Promise<void> {
    if (!this.currentStoredWallet) {
      this.snackBar.open('Wallet is not connected! Please connect wallet first.', 'Close');
      return;
    }

    if (this.minimumGasPrice === undefined) {
      this.snackBar.open('Invalid gas fee!');
      return;
    }

    this.submitCreateValidator.emit({
      moniker,
      identity,
      website,
      security_contact,
      details,
      rate,
      max_rate,
      max_change_rate,
      min_self_delegation,
      delegator_address,
      validator_address,
      denom,
      amount,
      ip,
      node_id,
      pubkey,
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
