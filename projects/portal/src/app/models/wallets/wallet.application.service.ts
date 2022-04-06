import { ConnectWalletCompletedDialogComponent } from '../../views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.component';
import { ConnectWalletStartDialogComponent } from '../../views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.component';
import { UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-backup-mnemonic-and-private-key-wizard-dialog/ununifi-backup-mnemonic-and-private-key-wizard-dialog.component';
import { UnunifiCreateWalletFormDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-create-wallet-form-dialog/ununifi-create-wallet-form-dialog.component';
import { UnunifiImportWalletWithMnemonicFormDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-import-wallet-with-mnemonic-form-dialog/ununifi-import-wallet-with-mnemonic-form-dialog.component';
import { UnunifiSelectCreateImportDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-select-create-import-dialog/ununifi-select-create-import-dialog.component';
import { UnunifiSelectWalletDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-select-wallet-dialog/ununifi-select-wallet-dialog.component';
import { WalletType, StoredWallet } from './wallet.model';
import { WalletService } from './wallet.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class WalletApplicationService {
  constructor(
    private readonly walletService: WalletService,
    private readonly dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  async connectWalletDialog(): Promise<void> {
    const currentCosmosWallet = await this.walletService.getCurrentCosmosWallet();

    const selectedWalletType = await this.openConnectWalletStartDialog();

    if (!selectedWalletType) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return;
    }

    // Todo: After implementation, this should be removed
    if (
      selectedWalletType === WalletType.keplr ||
      selectedWalletType === WalletType.keyStation ||
      selectedWalletType === WalletType.ledger
    ) {
      this.snackBar.open('Selected Wallet is not supported yet!', 'Close');
      return;
    }

    if (
      selectedWalletType !== WalletType.ununifi &&
      selectedWalletType !== WalletType.keplr &&
      selectedWalletType !== WalletType.keyStation &&
      selectedWalletType !== WalletType.ledger
    ) {
      this.snackBar.open('Invalid wallet type!', 'Close');
      return;
    }

    if (selectedWalletType === WalletType.ununifi) {
      const selectOrImportOrCreate = await this.openUnunifiSelectCreateImportDialog();

      if (!selectOrImportOrCreate) {
        this.snackBar.open('Dialog was canceled!', 'Close');
        return;
      }

      if (selectOrImportOrCreate === 'select') {
        const selectedStoredWallet = await this.openUnunifiSelectWalletDialog();
        if (!selectedStoredWallet) {
          this.snackBar.open('Dialog was canceled!', 'Close');
          return;
        }
        await this.walletService.setCurrentStoredWallet(selectedStoredWallet);
        await this.openConnectWalletCompletedDialog(selectedStoredWallet);
        return;
      }

      if (selectOrImportOrCreate === 'create') {
        const privateWallet = await this.openUnunifiCreateWalletDialog();
        if (!privateWallet) {
          this.snackBar.open('Dialog was canceled!', 'Close');
          return;
        }
        const backupResult = await this.openUnunifiBackupMnemonicAndPrivateKeyDialog(privateWallet);
        if (!(backupResult?.checked && backupResult.saved)) {
          this.snackBar.open('Backup failed! Try again.', 'Close');
          return;
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
        this.snackBar.open('Successfully wallet connected.', undefined, {
          duration: 2000,
        });
        return;
      }

      if (selectOrImportOrCreate === 'import') {
        const privateWallet = await this.openUnunifiImportWalletWithMnemonicDialog();
        if (!privateWallet) {
          this.snackBar.open('Dialog was canceled!', 'Close');
          return;
        }
        const backupResult = await this.openUnunifiBackupMnemonicAndPrivateKeyDialog(privateWallet);
        if (!(backupResult?.checked && backupResult.saved)) {
          this.snackBar.open('Backup failed! Try again.', 'Close');
          return;
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
        return;
      }
    }
  }

  async openConnectWalletStartDialog(): Promise<WalletType | undefined> {
    const selectedWalletType: WalletType = await this.dialog
      .open(ConnectWalletStartDialogComponent)
      .afterClosed()
      .toPromise();
    return selectedWalletType;
  }

  async openUnunifiSelectCreateImportDialog(): Promise<'select' | 'import' | 'create' | undefined> {
    const selectedResult: 'select' | 'import' | 'create' | undefined = await this.dialog
      .open(UnunifiSelectCreateImportDialogComponent)
      .afterClosed()
      .toPromise();
    return selectedResult;
  }

  async openUnunifiSelectWalletDialog(): Promise<StoredWallet | undefined> {
    const selectedStoredWallet: StoredWallet | undefined = await this.dialog
      .open(UnunifiSelectWalletDialogComponent)
      .afterClosed()
      .toPromise();
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

  async openUnunifiImportWalletWithMnemonicDialog(): Promise<
    (StoredWallet & { mnemonic: string; privateKey: string }) | undefined
  > {
    const privateWallet: StoredWallet & { mnemonic: string; privateKey: string } = await this.dialog
      .open(UnunifiImportWalletWithMnemonicFormDialogComponent)
      .afterClosed()
      .toPromise();
    return privateWallet;
  }

  async openUnunifiBackupMnemonicAndPrivateKeyDialog(
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

  // WIP

  async openConnectWalletCompletedDialog(connectedStoredWallet: StoredWallet): Promise<void> {
    await this.dialog
      .open(ConnectWalletCompletedDialogComponent, { data: connectedStoredWallet })
      .afterClosed()
      .toPromise();
  }
}
