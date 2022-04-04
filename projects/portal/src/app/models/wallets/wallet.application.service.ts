import { ConnectWalletStartDialogComponent } from '../../views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.component';
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
    if (
      selectedWalletType === WalletType.keplr ||
      selectedWalletType === WalletType.keyStation ||
      selectedWalletType === WalletType.ledger
    ) {
      this.snackBar.open('Selected Wallet is not supported yet!', 'Close');
      return;
    }
  }

  async openConnectWalletStartDialog(): Promise<WalletType | undefined> {
    const selectedWalletType: WalletType = await this.dialog
      .open(ConnectWalletStartDialogComponent)
      .afterClosed()
      .toPromise();
    return selectedWalletType;
  }

  // WIP
}
