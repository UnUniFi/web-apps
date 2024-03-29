import { EditValidatorData } from '../../../models/cosmos/staking.model';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';

@Component({
  selector: 'view-edit-validator-simple',
  templateUrl: './edit-validator-simple.component.html',
  styleUrls: ['./edit-validator-simple.component.css'],
})
export class ViewEditValidatorSimpleComponent implements OnInit, OnChanges {
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
  @Input() minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  @Output() submitEditValidator = new EventEmitter<
    EditValidatorData & {
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
      this.snackBar.open(`Error: minmumGasPrice.amount is invalid!`, 'Close');
      return;
    }
    if (!this.moniker) {
      this.moniker = '';
    }
    if (!this.identity) {
      this.identity = '';
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
      this.rate = '';
    }
    if (!this.min_self_delegation) {
      this.min_self_delegation = '';
    }
    if (!this.delegator_address) {
      this.snackBar.open(`Error: delegator_address is invalid!`, 'Close');
      return;
    }
    if (!this.validator_address) {
      this.snackBar.open(`Error: validator_address is invalid!`, 'Close');
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
      minimumGasPrice: {
        denom: this.minimumGasPrice.denom,
        amount: minimumGasPriceAmount,
      },
      privateKey,
    });
  }

  onClickInputForm() {
    const fileInputForm: HTMLElement | null = document.getElementById('fileInputForm');
    if (fileInputForm) fileInputForm.click();
  }
}
