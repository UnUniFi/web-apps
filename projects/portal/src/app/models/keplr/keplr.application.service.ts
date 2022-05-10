import { ConnectWalletCompletedDialogComponent } from '../../views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.component';
import { KeplrImportWalletDialogComponent } from '../../views/dialogs/wallets/keplr/keplr-import-wallet-dialog/keplr-import-wallet-dialog.component';
import { StoredWallet } from '../wallets/wallet.model';
import { WalletService } from '../wallets/wallet.service';
import { KeplrService } from './keplr.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { cosmosclient } from '@cosmos-client/core';
import { Key } from '@keplr-wallet/types';
import { LoadingDialogService } from 'ng-loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class KeplrApplicationService {
  constructor(
    private readonly walletService: WalletService,
    private readonly keplrService: KeplrService,
    private readonly dialog: MatDialog,
    private readonly loadingDialog: LoadingDialogService,
    private snackBar: MatSnackBar,
  ) {}

  async keplrSelectWallet(): Promise<boolean> {
    const selectedStoredWallet = await this.openKeplrImportWalletDialog();
    if (!selectedStoredWallet) {
      this.snackBar.open('Dialog was canceled!', 'Close');
      return false;
    }
    await this.walletService.setStoredWallet(selectedStoredWallet);
    await this.walletService.setCurrentStoredWallet(selectedStoredWallet);
    await this.openConnectWalletCompletedDialog(selectedStoredWallet);
    return true;
  }

  async openKeplrImportWalletDialog(): Promise<StoredWallet | undefined> {
    const selectedStoredWallet: StoredWallet | undefined = await this.dialog
      .open(KeplrImportWalletDialogComponent)
      .afterClosed()
      .toPromise();
    return selectedStoredWallet;
  }

  async openConnectWalletCompletedDialog(connectedStoredWallet: StoredWallet): Promise<void> {
    await this.dialog
      .open(ConnectWalletCompletedDialogComponent, { data: connectedStoredWallet })
      .afterClosed()
      .toPromise();
  }

  async getKey(): Promise<Key | undefined> {
    const dialogRefGetKey = this.loadingDialog.open('Loading Keplr...');
    try {
      await this.keplrService.suggestChain();
    } catch (error) {
      console.error(error);
      const errorMessage = `Keplr Connection failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
      dialogRefGetKey.close();
      return;
    }
    let keyData: Key | undefined;
    try {
      keyData = await this.keplrService.getKey();
    } catch (error) {
      console.error(error);
      const errorMessage = `Keplr Connection failed: ${(error as Error).toString()}`;
      this.snackBar.open(`An error has occur: ${errorMessage}`, 'Close');
    } finally {
      dialogRefGetKey.close();
    }
    return keyData;
  }

  async signDirect(
    txBuilder: cosmosclient.TxBuilder,
    accountNumber: Long.Long,
    address: string,
  ): Promise<cosmosclient.TxBuilder> {
    const signDoc = txBuilder.signDoc(accountNumber);
    const signKeplr = await this.keplrService.signDirect(
      address,
      signDoc.body_bytes,
      signDoc.auth_info_bytes,
      signDoc.account_number,
    );
    if (!signKeplr) {
      throw Error('Invalid signature!');
    }
    txBuilder.txRaw.auth_info_bytes = signKeplr.authInfoBytes;
    txBuilder.txRaw.body_bytes = signKeplr.bodyBytes;
    txBuilder.addSignature(signKeplr.signature);

    return txBuilder;
  }
}
