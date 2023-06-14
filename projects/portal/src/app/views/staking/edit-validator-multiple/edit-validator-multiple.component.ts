import { CreateValidatorData } from '../../../models/cosmos/staking.model';
import { KeyType } from '../../../models/keys/key.model';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { InterfaceCreateValidatorsData } from '../../../pages/staking/create-validator-multiple/create-validator-multiple.component';
import { createCosmosPublicKeyFromString } from '../../../utils/key';
import { Dialog, DIALOG_DATA } from '@angular/cdk/dialog';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { RejectedFile } from 'ngx-dropzone/lib/ngx-dropzone.service';

export interface InterfaceWalletBackupFileContent {
  id: string;
  type: string;
  mnemonic: string;
  key_type: string;
  privateKey: string;
  public_key: string;
  address: string;
}

export interface InterfaceWalletBackupFile {
  name: string;
  content: InterfaceWalletBackupFileContent;
}

export type InterfaceTemplateToRender = 'loading' | 'form' | 'success';

@Component({
  selector: 'view-edit-validator-multiple',
  templateUrl: './edit-validator-multiple.component.html',
  styleUrls: ['./edit-validator-multiple.component.css'],
})
export class ViewEditValidatorMultipleComponent implements OnInit, OnChanges {
  @Input() nodes?: any[] | null;
  @Input() loading?: boolean;
  @Input() error?: string;
  @Input() setError?: (error: string) => void;
  @Input() success?: boolean;
  @Input() minimumGasPrices?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input() redirectUrls?: string[];
  @Output() submitCreateValidators = new EventEmitter<InterfaceCreateValidatorsData>();

  @ViewChild('fileInputRef') fileInputRef?: ElementRef;

  minimumGasPrice?: cosmosclient.proto.cosmos.base.v1beta1.ICoin;

  templateToRender: InterfaceTemplateToRender = 'loading';

  constructor(private readonly snackBar: MatSnackBar, public dialog: Dialog) {}

  openDialog() {
    this.dialog.open(ValidatorDialogComponent, {
      data: {
        redirectUrls: this.redirectUrls,
      },
      width: '420px',
    });
  }

  setTemplate() {
    if (this.loading) {
      this.templateToRender = 'loading';
      return;
    }
    if (this.success) {
      this.templateToRender = 'success';
      return;
    }
    this.templateToRender = 'form';
  }
  ngOnChanges(): void {
    this.setTemplate();

    if (this.minimumGasPrices && this.minimumGasPrices.length > 0) {
      this.minimumGasPrice = this.minimumGasPrices[0];
    }

    if (this.error) {
      // if setError in parents fire, we will warn user
      this.snackBar.open(this.error, 'dismiss', {
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
    }
  }

  ngOnInit(): void {}

  checkInput(input: any) {
    if (!input) {
      throw new Error('Error: something went wrong. Please reload and try again');
    }
  }
  files: InterfaceWalletBackupFile[] = [];

  handleRejectedFiles(rejectedFiles: RejectedFile[]) {
    if (rejectedFiles.length === 0) return;
    rejectedFiles.map((file: RejectedFile) => {
      const { reason } = file;
      if (reason === 'type') {
        throw new Error(`Error: wrong file format. Please upload a .txt file`);
      }
    });
    return;
  }
  checkDuplicateFiles(fileContent: InterfaceWalletBackupFileContent) {
    const { privateKey } = fileContent;
    const existed = this.files.find((item: InterfaceWalletBackupFile) => {
      const { content } = item;
      return content.privateKey === privateKey;
    });
    return !!existed;
  }

  async getFileContent(file: File): Promise<InterfaceWalletBackupFileContent> {
    const content = await file.text();
    return JSON.parse(content);
  }

  async formatFile(file: File) {
    if (!this.setError) {
      throw new Error('Error: something went wrong. Please try again');
    }
    const fileContent = await this.getFileContent(file);
    if (!fileContent.privateKey) {
      const errorMsg = `Error: invalid file. Please upload your wallet-backup file`;
      this.setError(errorMsg);
      throw new Error(errorMsg);
    }
    const dup = this.checkDuplicateFiles(fileContent);
    if (dup) {
      const errorMsg = 'Error: duplicate file';
      this.setError(errorMsg);
      throw new Error(errorMsg);
    }
    return {
      name: file.name,
      content: fileContent,
    };
  }

  async formatFiles(addedFiles: File[]): Promise<InterfaceWalletBackupFile[]> {
    return Promise.all(
      addedFiles.map(async (file: File) => {
        return this.formatFile(file);
      }),
    );
  }

  async onSelect(event: NgxDropzoneChangeEvent) {
    try {
      if (!this.setError) return;
      this.setError('');
      const { rejectedFiles, addedFiles } = event;
      if (!this.nodes) {
        const errorMsg = 'Error: nodes data is not ready';
        this.setError(errorMsg);
        throw new Error(errorMsg);
      }
      if (addedFiles.length > this.nodes.length) {
        this.snackBar.open(`Error: Maximum ${this.nodes.length} file(s)`, 'dismiss', {
          verticalPosition: 'bottom',
          horizontalPosition: 'right',
        });
        return;
      }
      this.handleRejectedFiles(rejectedFiles);

      const files = await this.formatFiles(addedFiles);

      this.files.push(...files);
    } catch (error: any) {
      const { message } = error;
      this.snackBar.open(message, 'dismiss', {
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
      });
    }
  }

  onRemove(file: InterfaceWalletBackupFile) {
    const { privateKey } = file.content;
    const fileIndex = this.files.findIndex((file) => file.content.privateKey === privateKey);
    this.files.splice(fileIndex, 1);
  }

  prepareCreateValidatorsData(): InterfaceCreateValidatorsData {
    const minimumGasPrice = {
      denom: this.minimumGasPrice?.denom,
      amount: this.minimumGasPrice?.amount,
    };
    return this.files.map((file: InterfaceWalletBackupFile) => {
      const { public_key, privateKey } = file.content;
      if (!this.nodes) {
        throw new Error('Error: something went wrong. Please try again');
      }
      const node = this.nodes.find((node) => node.subNode.pubKey === public_key);
      if (!this.setError) {
        throw new Error('Error: something went wrong. Please try again');
      }
      if (!node) {
        const errorMsg = 'Error: public_key mismatch. Please check your file';
        this.setError(errorMsg);
        throw new Error(errorMsg);
      }
      const {
        identity,
        website,
        security_contact,
        details,
        moniker,
        validatorId: node_id,
        denom,
        createValidatorAmount: amount,
        minSelfDelegation: min_self_delegation,
        commissionRate: rate,
        commissionMaxRate: max_rate,
        commissionMaxChangeRate: max_change_rate,
        accAddress: delegator_address,
        ipv6Domain: ip,
        consensusPubkey,
      } = node.subNode;

      const accAddress = cosmosclient.AccAddress.fromString(delegator_address);

      const valAddress = accAddress.toValAddress().toString();
      return {
        moniker,
        identity: identity || moniker,
        website,
        security_contact,
        details,
        rate,
        max_rate,
        max_change_rate,
        min_self_delegation,
        delegator_address,
        validator_address: valAddress,
        denom,
        amount,
        ip,
        node_id,
        pubkey: JSON.stringify(consensusPubkey),
        minimumGasPrice,
        privateKey,
      };
    });
  }
  async onSubmitCreateValidators(): Promise<void> {
    try {
      const createValidatorsData = this.prepareCreateValidatorsData();
      this.submitCreateValidators.emit(createValidatorsData);
    } catch (error: any) {
      const { message } = error;
      this.snackBar.open(message);
    }
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

@Component({
  selector: 'app-view-validator-dialog',
  templateUrl: 'validator-dialog.html',
})
export class ValidatorDialogComponent {
  constructor(@Inject(DIALOG_DATA) public data: { redirectUrls: string[] | undefined }) {}
}
