import { ConnectWalletCompletedDialogComponent } from '../../../views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.component';
import { KeplrImportWalletDialogComponent } from '../../../views/dialogs/wallets/keplr/keplr-import-wallet-dialog/keplr-import-wallet-dialog.component';
import { StoredWallet } from '../wallet.model';
import { WalletService } from '../wallet.service';
import { KeplrService } from './keplr.service';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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

  // async getAccAddress(): Promise<cosmosclient.AccAddress | undefined> {
  //   return this.keplrService
  //     .getKey()
  //     .then((key) => {
  //       if (!key) {
  //         console.error('Fail.');
  //         return undefined;
  //       }
  //       const pubkey = createCosmosPublicKeyFromUint8Array(KeyType.secp256k1, key.pubKey);
  //       if (!pubkey) {
  //         console.error('Invalid Pubkey.');
  //         return undefined;
  //       }
  //       const accAddress = cosmosclient.AccAddress.fromPublicKey(pubkey);
  //       return accAddress;
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       return undefined;
  //     });
  // }

  // async getPubkey(): Promise<string | undefined> {
  //   return this.keplrService
  //     .getKey()
  //     .then((key) => {
  //       if (!key) {
  //         console.error('Fail.');
  //         return undefined;
  //       }
  //       const pubkey = createCosmosPublicKeyFromUint8Array(KeyType.secp256k1, key.pubKey);
  //       if (!pubkey) {
  //         console.error('Invalid Pubkey.');
  //         return undefined;
  //       }
  //       return Buffer.from(pubkey.bytes).toString();
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       return undefined;
  //     });
  // }
}
