import { ConnectExternalWalletDialogComponent } from '../../views/dialogs/wallets/connect-external-cosmos-dialog/connect-external-wallet-dialog.component';
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
import { ExternalChain } from '../../views/yieldaggregator/vaults/vault/vault.component';
import { KeplrService } from './keplr/keplr.service';
import { LeapService } from './leap/leap.service';
import { MetaMaskService } from './metamask/metamask.service';
import { WalletType, StoredWallet } from './wallet.model';
import { WalletService } from './wallet.service';
import { Dialog } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Key } from '@keplr-wallet/types';
import { LoadingDialogService } from 'projects/shared/src/lib/components/loading-dialog';

@Injectable({
  providedIn: 'root',
})
export class WalletApplicationService {
  constructor(
    private readonly walletService: WalletService,
    private readonly keplrService: KeplrService,
    private readonly leapService: LeapService,
    private readonly metaMaskService: MetaMaskService,
    private readonly dialog: Dialog,
    private snackBar: MatSnackBar,
    private loadingDialog: LoadingDialogService,
  ) {}

  async disconnectWallet(): Promise<void> {
    await this.walletService.deleteStoredWallet();
    window.location.reload();
    return;
  }

  async connectWalletDialog(): Promise<void> {
    const selectedWalletType = await this.openConnectWalletStartDialog();

    if (!selectedWalletType) {
      return;
    }

    if (selectedWalletType === WalletType.ununifi) {
      const selectOrImportOrCreate = await this.openUnunifiSelectCreateImportDialog();

      if (!selectOrImportOrCreate) {
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

    const isSuccessConnected = await (async () => {
      switch (selectedWalletType) {
        case WalletType.keplr:
          return await this.connectWallet(this.keplrService);
        case WalletType.leap:
          return await this.connectWallet(this.leapService);
        default:
          return false;
      }
    })();

    if (isSuccessConnected) {
      window.location.reload();
    }
    return;
  }

  async ununifiSelectWallet(): Promise<boolean> {
    const selectedStoredWallet = await this.openUnunifiSelectWalletDialog();
    if (!selectedStoredWallet) {
      return false;
    }
    await this.walletService.setCurrentStoredWallet(selectedStoredWallet);
    await this.openConnectWalletCompletedDialog(selectedStoredWallet);
    return true;
  }

  async ununifiImportWallet(): Promise<boolean> {
    const privateWallet = await this.openUnunifiImportWalletWithMnemonicDialog();
    if (!privateWallet) {
      return false;
    }
    const backupResult = await this.openUnunifiBackupMnemonicAndPrivateKeyDialog(privateWallet);
    if (!(backupResult?.checked && backupResult.saved)) {
      this.snackBar.open('Backup failed. Try again.', 'Close');
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
      return false;
    }
    const backupResult = await this.openUnunifiBackupPrivateKeyDialog(privateWallet);
    if (!(backupResult?.checked && backupResult.saved)) {
      this.snackBar.open('Backup failed. Try again.', 'Close');
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
      return false;
    }
    const backupResult = await this.openUnunifiBackupMnemonicAndPrivateKeyDialog(privateWallet);
    if (!(backupResult?.checked && backupResult.saved)) {
      this.snackBar.open('Backup failed. Try again.', 'Close');
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

  async getExternalWallet(chain: ExternalChain): Promise<string | undefined> {
    if (chain.id == 'ununifi') {
      return;
    }
    const selectedWalletType = await this.openConnectExternalWalletDialog(chain);
    const connectedWallet = await (async () => {
      switch (selectedWalletType) {
        case WalletType.keplr:
          const keplrKey = await this.connectExternalWallet(this.keplrService, chain.id);
          return keplrKey?.bech32Address;
        case WalletType.leap:
          const leapKey = await this.connectExternalWallet(this.leapService, chain.id);
          return leapKey?.bech32Address;
        case WalletType.metamask:
          return await this.metaMaskService.getEthAddress();
        case WalletType.walletConnect:
          // return await this.connectExternalWallet(this.walletConnectService);
          this.snackBar.open('WalletConnect is not supported yet.', 'Close');
          return;
        default:
          return;
      }
    })();
    return connectedWallet;
  }

  async connectWallet(walletService: {
    connectWallet(): Promise<StoredWallet | null | undefined>;
  }): Promise<boolean> {
    const connectedStoredWallet = await walletService.connectWallet();
    if (!connectedStoredWallet) {
      return false;
    }
    await this.walletService.setCurrentStoredWallet(connectedStoredWallet);
    await this.openConnectWalletCompletedDialog(connectedStoredWallet);
    return true;
  }

  async connectExternalWallet(
    walletService: {
      connectExternalWallet(id: string): Promise<Key | null | undefined>;
    },
    id: string,
  ): Promise<Key | null | undefined> {
    const connectedStoredWallet = await walletService.connectExternalWallet(id);
    return connectedStoredWallet;
  }

  async keplrConnectWallet(): Promise<boolean> {
    const connectedStoredWallet = await this.keplrService.connectWallet();
    if (!connectedStoredWallet) {
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
      this.snackBar.open('Failed to connect to MetaMask.', 'Close');
      return false;
    }
    await this.walletService.setCurrentStoredWallet(connectedStoredWallet);
    await this.openConnectWalletCompletedDialog(connectedStoredWallet);
    return true;
  }

  async openConnectWalletStartDialog(): Promise<WalletType | undefined> {
    const selectedWalletType: WalletType | undefined = await this.dialog
      .open<WalletType>(ConnectWalletStartDialogComponent)
      .closed.toPromise();
    return selectedWalletType;
  }

  async openConnectExternalWalletDialog(chain: ExternalChain): Promise<WalletType | undefined> {
    const selectedWalletType: WalletType | undefined = await this.dialog
      .open<WalletType>(ConnectExternalWalletDialogComponent, { data: chain })
      .closed.toPromise();
    return selectedWalletType;
  }

  async openUnunifiSelectCreateImportDialog(): Promise<
    UnunifiSelectCreateImportDialogData | undefined
  > {
    const selectedResult: UnunifiSelectCreateImportDialogData | undefined = await this.dialog
      .open<UnunifiSelectCreateImportDialogData>(UnunifiSelectCreateImportDialogComponent)
      .closed.toPromise();

    return selectedResult;
  }

  async openUnunifiSelectWalletDialog(): Promise<StoredWallet | undefined> {
    const selectedStoredWallet: StoredWallet | undefined = await this.dialog
      .open<StoredWallet>(UnunifiSelectWalletDialogComponent)
      .closed.toPromise();
    return selectedStoredWallet;
  }

  async openUnunifiCreateWalletDialog(): Promise<
    (StoredWallet & { mnemonic: string; privateKey: string }) | undefined
  > {
    const privateWallet: (StoredWallet & { mnemonic: string; privateKey: string }) | undefined =
      await this.dialog
        .open<StoredWallet & { mnemonic: string; privateKey: string }>(
          UnunifiCreateWalletFormDialogComponent,
        )
        .closed.toPromise();
    return privateWallet;
  }

  async openUnunifiImportWalletWithPrivateKeyDialog(): Promise<
    (StoredWallet & { mnemonic: string; privateKey: string }) | undefined
  > {
    const privateWallet: (StoredWallet & { mnemonic: string; privateKey: string }) | undefined =
      await this.dialog
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
      await this.dialog
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
      | undefined = await this.dialog
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
      | undefined = await this.dialog
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
    await this.dialog
      .open(ConnectWalletCompletedDialogComponent, { data: connectedStoredWallet })
      .closed.toPromise();
  }

  async openUnunifiKeyFormDialog(): Promise<(StoredWallet & { privateKey: string }) | undefined> {
    const privateKey = await this.dialog
      .open<StoredWallet & { privateKey: string }>(UnunifiKeyFormDialogComponent)
      .closed.toPromise();
    return privateKey;
  }
}
