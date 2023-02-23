import { LoadingDialogService } from '../../../components/loading-dialog';
import { createCosmosPrivateKeyFromString } from '../../../utils/key';
import { validatePrivateStoredWallet } from '../../../utils/validation';
import { ConnectWalletCompletedDialogComponent } from '../../../views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.component';
import { UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent } from '../../../views/dialogs/wallets/ununifi/ununifi-backup-mnemonic-and-private-key-wizard-dialog/ununifi-backup-mnemonic-and-private-key-wizard-dialog.component';
import { UnunifiBackupPrivateKeyWizardDialogComponent } from '../../../views/dialogs/wallets/ununifi/ununifi-backup-private-key-wizard-dialog/ununifi-backup-private-key-wizard-dialog.component';
import { UnunifiCreateWalletFormDialogComponent } from '../../../views/dialogs/wallets/ununifi/ununifi-create-wallet-form-dialog/ununifi-create-wallet-form-dialog.component';
import { UnunifiImportWalletWithMnemonicFormDialogComponent } from '../../../views/dialogs/wallets/ununifi/ununifi-import-wallet-with-mnemonic-form-dialog/ununifi-import-wallet-with-mnemonic-form-dialog.component';
import { UnunifiImportWalletWithPrivateKeyFormDialogComponent } from '../../../views/dialogs/wallets/ununifi/ununifi-import-wallet-with-private-key-form-dialog/ununifi-import-wallet-with-private-key-form-dialog.component';
import { UnunifiKeyFormDialogComponent } from '../../../views/dialogs/wallets/ununifi/ununifi-key-form-dialog/ununifi-key-form-dialog.component';
import {
  UnunifiSelectCreateImportDialogData,
  UnunifiSelectCreateImportDialogComponent,
} from '../../../views/dialogs/wallets/ununifi/ununifi-select-create-import-dialog/ununifi-select-create-import-dialog.component';
import { UnunifiSelectWalletDialogComponent } from '../../../views/dialogs/wallets/ununifi/ununifi-select-wallet-dialog/ununifi-select-wallet-dialog.component';
import { KeyType } from '../../keys/key.model';
import { StoredWallet } from '../wallet.model';
import { WalletService } from '../wallet.service';
import { IUnunifiWalletInfrastructureService } from './ununifi-wallet.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import cosmosclient from '@cosmos-client/core';

@Injectable({
  providedIn: 'root',
})
export class UnunifiWalletInfrastructureService implements IUnunifiWalletInfrastructureService {
  constructor(
    private readonly walletService: WalletService,
    private readonly dialog: MatDialog,
    private readonly tmp_dialog: Dialog,
    private snackBar: MatSnackBar,
    private loadingDialog: LoadingDialogService,
  ) {}

  private async ununifiSelectWallet(): Promise<boolean> {
    const selectedStoredWallet = await this.openUnunifiSelectWalletDialog();
    if (!selectedStoredWallet) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return false;
    }
    await this.walletService.setCurrentStoredWallet(selectedStoredWallet);
    await this.openConnectWalletCompletedDialog(selectedStoredWallet);
    return true;
  }

  private async ununifiImportWallet(): Promise<boolean> {
    const privateWallet = await this.openUnunifiImportWalletWithMnemonicDialog();
    if (!privateWallet) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return false;
    }
    const backupResult = await this.openUnunifiBackupMnemonicAndPrivateKeyDialog(privateWallet);
    if (!(backupResult?.checked && backupResult.saved)) {
      this.snackBar.open('Backup failed! Try again.', 'Close');
      return false;
    }
    const storedWallet = {
      id: privateWallet.id,
      type: privateWallet.type,
      key_type: privateWallet.key_type,
      public_key: privateWallet.public_key,
      address: privateWallet.address,
    };
    await this.walletService.setStoredWallet(storedWallet);
    await this.walletService.setCurrentStoredWallet(storedWallet);
    await this.openConnectWalletCompletedDialog(storedWallet);
    return true;
  }

  private async ununifiImportWalletWithPrivateKey(): Promise<boolean> {
    const privateWallet = await this.openUnunifiImportWalletWithPrivateKeyDialog();
    if (!privateWallet) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return false;
    }
    const backupResult = await this.openUnunifiBackupPrivateKeyDialog(privateWallet);
    if (!(backupResult?.checked && backupResult.saved)) {
      this.snackBar.open('Backup failed! Try again.', 'Close');
      return false;
    }
    const storedWallet = {
      id: privateWallet.id,
      type: privateWallet.type,
      key_type: privateWallet.key_type,
      public_key: privateWallet.public_key,
      address: privateWallet.address,
    };
    await this.walletService.setStoredWallet(storedWallet);
    await this.walletService.setCurrentStoredWallet(storedWallet);
    await this.openConnectWalletCompletedDialog(storedWallet);
    return true;
  }

  private async ununifiCreateWallet(): Promise<boolean> {
    const privateWallet = await this.openUnunifiCreateWalletDialog();
    if (!privateWallet) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return false;
    }
    const backupResult = await this.openUnunifiBackupMnemonicAndPrivateKeyDialog(privateWallet);
    if (!(backupResult?.checked && backupResult.saved)) {
      this.snackBar.open('Backup failed! Try again.', 'Close');
      return false;
    }
    const storedWallet = {
      id: privateWallet.id,
      type: privateWallet.type,
      key_type: privateWallet.key_type,
      public_key: privateWallet.public_key,
      address: privateWallet.address,
    };
    await this.walletService.setStoredWallet(storedWallet);
    await this.walletService.setCurrentStoredWallet(storedWallet);
    await this.openConnectWalletCompletedDialog(storedWallet);
    return true;
  }

  private async openUnunifiSelectCreateImportDialog(): Promise<
    UnunifiSelectCreateImportDialogData | undefined
  > {
    const selectedResult: UnunifiSelectCreateImportDialogData | undefined = await this.tmp_dialog
      .open<UnunifiSelectCreateImportDialogData>(UnunifiSelectCreateImportDialogComponent)
      .closed.toPromise();

    return selectedResult;
  }

  private async openUnunifiSelectWalletDialog(): Promise<StoredWallet | undefined> {
    const selectedStoredWallet: StoredWallet | undefined = await this.tmp_dialog
      .open<StoredWallet>(UnunifiSelectWalletDialogComponent)
      .closed.toPromise();
    return selectedStoredWallet;
  }

  private async openUnunifiCreateWalletDialog(): Promise<
    (StoredWallet & { mnemonic: string; privateKey: string }) | undefined
  > {
    const privateWallet: StoredWallet & { mnemonic: string; privateKey: string } = await this.dialog
      .open(UnunifiCreateWalletFormDialogComponent)
      .afterClosed()
      .toPromise();
    return privateWallet;
  }

  private async openUnunifiImportWalletWithPrivateKeyDialog(): Promise<
    (StoredWallet & { mnemonic: string; privateKey: string }) | undefined
  > {
    const privateWallet: StoredWallet & { mnemonic: string; privateKey: string } = await this.dialog
      .open(UnunifiImportWalletWithPrivateKeyFormDialogComponent)
      .afterClosed()
      .toPromise();
    return privateWallet;
  }

  private async openUnunifiImportWalletWithMnemonicDialog(): Promise<
    (StoredWallet & { mnemonic: string; privateKey: string }) | undefined
  > {
    const privateWallet: StoredWallet & { mnemonic: string; privateKey: string } = await this.dialog
      .open(UnunifiImportWalletWithMnemonicFormDialogComponent)
      .afterClosed()
      .toPromise();
    return privateWallet;
  }

  private async openUnunifiBackupMnemonicAndPrivateKeyDialog(
    privateWallet: StoredWallet & { mnemonic: string; privateKey: string },
  ): Promise<
    | (StoredWallet & { mnemonic: string; privateKey: string; checked: boolean; saved: boolean })
    | undefined
  > {
    const backupResult: StoredWallet & {
      mnemonic: string;
      privateKey: string;
      checked: boolean;
      saved: boolean;
    } = await this.dialog
      .open(UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent, { data: privateWallet })
      .afterClosed()
      .toPromise();
    return backupResult;
  }

  private async openUnunifiBackupPrivateKeyDialog(
    privateWallet: StoredWallet & { mnemonic: string; privateKey: string },
  ): Promise<
    | (StoredWallet & { mnemonic: string; privateKey: string; checked: boolean; saved: boolean })
    | undefined
  > {
    const backupResult: StoredWallet & {
      mnemonic: string;
      privateKey: string;
      checked: boolean;
      saved: boolean;
    } = await this.dialog
      .open(UnunifiBackupPrivateKeyWizardDialogComponent, { data: privateWallet })
      .afterClosed()
      .toPromise();
    return backupResult;
  }

  private async openConnectWalletCompletedDialog(
    connectedStoredWallet: StoredWallet,
  ): Promise<void> {
    await this.tmp_dialog
      .open(ConnectWalletCompletedDialogComponent, { data: connectedStoredWallet })
      .closed.toPromise();
  }

  private async openUnunifiKeyFormDialog(): Promise<StoredWallet & { privateKey: string }> {
    const privateKey = await this.dialog
      .open(UnunifiKeyFormDialogComponent)
      .afterClosed()
      .toPromise();
    return privateKey;
  }

  async connectWallet(): Promise<boolean> {
    const selectOrImportOrCreate = await this.openUnunifiSelectCreateImportDialog();

    if (!selectOrImportOrCreate) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return false;
    }

    if (selectOrImportOrCreate === 'select') {
      const isSuccessSelect = await this.ununifiSelectWallet();
      return isSuccessSelect;
    }

    if (selectOrImportOrCreate === 'import') {
      const isSuccessImport = await this.ununifiImportWallet();
      return isSuccessImport;
    }

    if (selectOrImportOrCreate === 'importWithPrivateKey') {
      const isSuccessImportWithPrivateKey = await this.ununifiImportWalletWithPrivateKey();
      return isSuccessImportWithPrivateKey;
    }

    if (selectOrImportOrCreate === 'create') {
      const isSuccessCreate = await this.ununifiCreateWallet();
      return isSuccessCreate;
    }

    return false;
  }

  async signTx(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
  ): Promise<cosmosclient.TxBuilder> {
    const privateWallet: StoredWallet & { privateKey: string } =
      await this.openUnunifiKeyFormDialog();
    if (!privateWallet || !privateWallet.privateKey) {
      const errorMessage = 'Failed to get Wallet info from dialog! Tray again!';
      this.snackBar.open(errorMessage, 'Close');
      throw Error(errorMessage);
    }
    if (!validatePrivateStoredWallet(privateWallet)) {
      const errorMessage = 'Invalid Wallet info!';
      this.snackBar.open(errorMessage, 'Close');
      throw Error(errorMessage);
    }
    const cosmosPrivateKey = createCosmosPrivateKeyFromString(
      KeyType.secp256k1,
      privateWallet.privateKey,
    );
    if (!cosmosPrivateKey) {
      const errorMessage = 'Invalid Private Key!';
      this.snackBar.open(errorMessage, 'Close');
      throw Error(errorMessage);
    }
    const signDocBytes = txBuilder.signDocBytes(signerBaseAccount.account_number);
    const signature = cosmosPrivateKey.sign(signDocBytes);
    txBuilder.addSignature(signature);
    return txBuilder;
  }

  async signTxWithPrivateKey(
    txBuilder: cosmosclient.TxBuilder,
    signerBaseAccount: cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount,
    privateKey: string,
  ): Promise<cosmosclient.TxBuilder | undefined> {
    const cosmosPrivateKey: cosmosclient.PrivKey | undefined = createCosmosPrivateKeyFromString(
      KeyType.secp256k1,
      privateKey,
    );
    if (!cosmosPrivateKey) {
      const errorMessage = 'Invalid Private Key!';
      this.snackBar.open(errorMessage, 'Close');
      throw Error(errorMessage);
    }
    const signDocBytes = txBuilder.signDocBytes(signerBaseAccount.account_number);
    const signature = cosmosPrivateKey.sign(signDocBytes);
    txBuilder.addSignature(signature);
    return txBuilder;
  }
}
