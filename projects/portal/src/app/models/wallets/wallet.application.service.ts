import { ConnectWalletStartDialogComponent } from '../../views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.component';
import { UnunifiSelectCreateImportDialogComponent } from '../../views/dialogs/wallets/ununifi/ununifi-select-create-import-dialog/ununifi-select-create-import-dialog.component';
import { WalletType } from './wallet.model';
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

    if (currentCosmosWallet) {
      this.snackBar.open('You have already connected your wallet to this app!', 'Close');
      return;
    }

    const selectedWalletType = await this.openConnectWalletStartDialog();

    if (!selectedWalletType) {
      this.snackBar.open('Connect Wallet Dialog is canceled!', 'Close');
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

    const selectOrImportOrCreate = await this.openUnunifiSelectCreateImportDialog();
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

  // WIP
}
