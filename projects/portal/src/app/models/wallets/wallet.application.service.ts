import { ConnectWalletCompletedDialogComponent } from '../../views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.component';
import { ConnectWalletStartDialogComponent } from '../../views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.component';
import { UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-backup-mnemonic-and-private-key-wizard-dialog/ununifi-backup-mnemonic-and-private-key-wizard-dialog.component';
import { UnunifiBackupPrivateKeyWizardDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-backup-private-key-wizard-dialog/ununifi-backup-private-key-wizard-dialog.component';
import { UnunifiCreateWalletFormDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-create-wallet-form-dialog/ununifi-create-wallet-form-dialog.component';
import { UnunifiImportWalletWithMnemonicFormDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-import-wallet-with-mnemonic-form-dialog/ununifi-import-wallet-with-mnemonic-form-dialog.component';
import { UnunifiImportWalletWithPrivateKeyFormDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-import-wallet-with-private-key-form-dialog/ununifi-import-wallet-with-private-key-form-dialog.component';
import { UnunifiKeyFormDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-key-form-dialog/ununifi-key-form-dialog.component';
import {
  UnunifiSelectCreateImportDialogData,
  UnunifiSelectCreateImportDialogComponent,
} from '../../views/dialogs/wallets/ununifi/ununifi-select-create-import-dialog/ununifi-select-create-import-dialog.component';
import { UnunifiSelectWalletDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-select-wallet-dialog/ununifi-select-wallet-dialog.component';
import { KeplrService } from './keplr/keplr.service';
import { MetaMaskService } from './metamask/metamask.service';
import { WalletType, StoredWallet } from './wallet.model';
import { WalletService } from './wallet.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class WalletApplicationService {
  constructor(
    private readonly walletService: WalletService,
    private readonly keplrService: KeplrService,
    private readonly metaMaskService: MetaMaskService,
    private readonly dialog: MatDialog,
    private readonly tmp_dialog: Dialog,
    private snackBar: MatSnackBar,
    private loadingDialog: LoadingDialogService,
  ) {}

  async connectWalletDialog(): Promise<void> {
    const selectedWalletType = await this.openConnectWalletStartDialog();

    if (!selectedWalletType) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return;
    }

    // Todo: After implementation, this should be removed
    if (selectedWalletType === WalletType.keyStation || selectedWalletType === WalletType.ledger) {
      this.snackBar.open('Selected Wallet is not supported yet!', 'Close');
      return;
    }

    if (selectedWalletType === WalletType.ununifi) {
      const selectOrImportOrCreate = await this.openUnunifiSelectCreateImportDialog();

      if (!selectOrImportOrCreate) {
        this.snackBar.open('Dialog was canceled!', 'Close');
        return;
      }

      if (selectOrImportOrCreate === 'select') {
        const isSuccessSelect = await this.ununifiSelectWallet();
        if (isSuccessSelect) {
          window.location.reload();
        }
        return;
      }

      if (selectOrImportOrCreate === 'import') {
        const isSuccessImport = await this.ununifiImportWallet();
        if (isSuccessImport) {
          window.location.reload();
        }
        return;
      }

      if (selectOrImportOrCreate === 'importWithPrivateKey') {
        const isSuccessImportWithPrivateKey = await this.ununifiImportWalletWithPrivateKey();
        if (isSuccessImportWithPrivateKey) {
          window.location.reload();
        }
        return;
      }

      if (selectOrImportOrCreate === 'create') {
        const isSuccessCreate = await this.ununifiCreateWallet();
        if (isSuccessCreate) {
          window.location.reload();
        }
        return;
      }
    }

    if (selectedWalletType === WalletType.keplr) {
      const isSuccessConnected = await this.keplrConnectWallet();
      if (isSuccessConnected) {
        window.location.reload();
      }
      return;
    }

    if (selectedWalletType === WalletType.metaMask) {
      // Todo: Currently disabled MetaMask related features.
      this.snackBar.open('Selected Wallet is not supported yet!', 'Close');
      return;
      // await this.metaMaskConnectWallet();
      // return;
    }

    this.snackBar.open('Invalid wallet type!', 'Close');
    return;
  }

  async ununifiSelectWallet(): Promise<boolean> {
    const selectedStoredWallet = await this.openUnunifiSelectWalletDialog();
    if (!selectedStoredWallet) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return false;
    }
    await this.walletService.setCurrentStoredWallet(selectedStoredWallet);
    await this.openConnectWalletCompletedDialog(selectedStoredWallet);
    return true;
  }

  async ununifiImportWallet(): Promise<boolean> {
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

  async ununifiImportWalletWithPrivateKey(): Promise<boolean> {
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

  async ununifiCreateWallet(): Promise<boolean> {
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

  async keplrConnectWallet(): Promise<boolean> {
    const connectedStoredWallet = await this.keplrService.connectWallet();
    if (!connectedStoredWallet) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return false;
    }
    await this.walletService.setCurrentStoredWallet(connectedStoredWallet);
    await this.openConnectWalletCompletedDialog(connectedStoredWallet);
    return true;
  }

  async metaMaskConnectWallet(): Promise<boolean> {
    const loadingDialogRef = this.loadingDialog.open('Connecting to MetaMask...');
    const connectedStoredWallet = await this.metaMaskService.connectWallet();
    loadingDialogRef.close();
    if (!connectedStoredWallet) {
      this.snackBar.open('Connecting MetaMask was failed!', 'Close');
      return false;
    }
    await this.walletService.setCurrentStoredWallet(connectedStoredWallet);
    await this.openConnectWalletCompletedDialog(connectedStoredWallet);
    return true;
  }

  async openConnectWalletStartDialog(): Promise<WalletType | undefined> {
    const selectedWalletType: WalletType | undefined = await this.tmp_dialog
      .open<WalletType>(ConnectWalletStartDialogComponent)
      .closed.toPromise();
    return selectedWalletType;
  }

  async openUnunifiSelectCreateImportDialog(): Promise<
    UnunifiSelectCreateImportDialogData | undefined
  > {
    const selectedResult: UnunifiSelectCreateImportDialogData | undefined = await this.tmp_dialog
      .open<UnunifiSelectCreateImportDialogData>(UnunifiSelectCreateImportDialogComponent)
      .closed.toPromise();

    return selectedResult;
  }

  async openUnunifiSelectWalletDialog(): Promise<StoredWallet | undefined> {
    const selectedStoredWallet: StoredWallet | undefined = await this.tmp_dialog
      .open<StoredWallet>(UnunifiSelectWalletDialogComponent)
      .closed.toPromise();
    return selectedStoredWallet;
  }

  async openUnunifiCreateWalletDialog(): Promise<
    (StoredWallet & { mnemonic: string; privateKey: string }) | undefined
  > {
    const privateWallet: StoredWallet & { mnemonic: string; privateKey: string } = await this.dialog
      .open(UnunifiCreateWalletFormDialogComponent)
      .afterClosed()
      .toPromise();
    return privateWallet;
  }

  async openUnunifiImportWalletWithPrivateKeyDialog(): Promise<
    (StoredWallet & { mnemonic: string; privateKey: string }) | undefined
  > {
    const privateWallet: (StoredWallet & { mnemonic: string; privateKey: string }) | undefined =
      await this.tmp_dialog
        .open<StoredWallet & { mnemonic: string; privateKey: string }>(
          UnunifiImportWalletWithPrivateKeyFormDialogComponent,
        )
        .closed.toPromise();
    return privateWallet;
  }

  async openUnunifiImportWalletWithMnemonicDialog(): Promise<
    (StoredWallet & { mnemonic: string; privateKey: string }) | undefined
  > {
    const privateWallet: (StoredWallet & { mnemonic: string; privateKey: string }) | undefined =
      await this.tmp_dialog
        .open<StoredWallet & { mnemonic: string; privateKey: string }>(
          UnunifiImportWalletWithMnemonicFormDialogComponent,
        )
        .closed.toPromise();
    return privateWallet;
  }

  async openUnunifiBackupMnemonicAndPrivateKeyDialog(
    privateWallet: StoredWallet & { mnemonic: string; privateKey: string },
  ): Promise<
    | (StoredWallet & { mnemonic: string; privateKey: string; checked: boolean; saved: boolean })
    | undefined
  > {
    const backupResult:
      | (StoredWallet & {
          mnemonic: string;
          privateKey: string;
          checked: boolean;
          saved: boolean;
        })
      | undefined = await this.tmp_dialog
      .open<
        StoredWallet & {
          mnemonic: string;
          privateKey: string;
          checked: boolean;
          saved: boolean;
        }
      >(UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent, { data: privateWallet })
      .closed.toPromise();
    return backupResult;
  }

  async openUnunifiBackupPrivateKeyDialog(
    privateWallet: StoredWallet & { mnemonic: string; privateKey: string },
  ): Promise<
    | (StoredWallet & { mnemonic: string; privateKey: string; checked: boolean; saved: boolean })
    | undefined
  > {
    const backupResult:
      | (StoredWallet & {
          mnemonic: string;
          privateKey: string;
          checked: boolean;
          saved: boolean;
        })
      | undefined = await this.tmp_dialog
      .open<
        StoredWallet & {
          mnemonic: string;
          privateKey: string;
          checked: boolean;
          saved: boolean;
        }
      >(UnunifiBackupPrivateKeyWizardDialogComponent, { data: privateWallet })
      .closed.toPromise();
    return backupResult;
  }
  async openConnectWalletCompletedDialog(connectedStoredWallet: StoredWallet): Promise<void> {
    await this.tmp_dialog
      .open(ConnectWalletCompletedDialogComponent, { data: connectedStoredWallet })
      .closed.toPromise();
  }

  async openUnunifiKeyFormDialog(): Promise<StoredWallet & { privateKey: string }> {
    const privateKey = await this.dialog
      .open(UnunifiKeyFormDialogComponent)
      .afterClosed()
      .toPromise();
    return privateKey;
  }
}
