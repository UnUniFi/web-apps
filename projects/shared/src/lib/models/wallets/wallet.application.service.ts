import { ConnectWalletCompletedDialogComponent } from '../../views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.component';
import { ConnectWalletStartDialogComponent } from '../../views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.component';
import { KeplrService } from './keplr/keplr.service';
import { MetaMaskService } from './metamask/metamask.service';
import { UnunifiWalletService } from './ununifi-wallet/ununifi-wallet.service';
import { WalletType, StoredWallet } from './wallet.model';
import { WalletService } from './wallet.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingDialogService } from 'ng-loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class WalletApplicationService {
  constructor(
    private readonly walletService: WalletService,
    private readonly keplrService: KeplrService,
    private readonly metaMaskService: MetaMaskService,
    private readonly ununifiWalletService: UnunifiWalletService,
    private readonly dialog: MatDialog,
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
      const isSuccessConnected = await this.ununifiConnectWallet();
      if (isSuccessConnected) {
        window.location.reload();
      }
      return;
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

  async ununifiConnectWallet(): Promise<boolean> {
    return await this.ununifiWalletService.connectWallet();
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
    const selectedWalletType: WalletType = await this.dialog
      .open(ConnectWalletStartDialogComponent)
      .afterClosed()
      .toPromise();
    return selectedWalletType;
  }

  async openConnectWalletCompletedDialog(connectedStoredWallet: StoredWallet): Promise<void> {
    await this.dialog
      .open(ConnectWalletCompletedDialogComponent, { data: connectedStoredWallet })
      .afterClosed()
      .toPromise();
  }
}
