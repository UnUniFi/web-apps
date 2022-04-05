import { ConnectWalletStartDialogComponent } from '../../views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.component';
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
        await this.walletService.load();
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

  // WIP
}
