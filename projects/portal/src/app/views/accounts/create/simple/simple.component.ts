import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';

@Component({
  selector: 'app-view-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css'],
})
export class SimpleComponent implements OnInit {
  @Input() privateWallet?: (StoredWallet & { mnemonic: string; privateKey: string }) | null;

  isAlreadyDownloadedWalletBackupFile: boolean;
  isAlreadyDownloadedPublicWalletFile: boolean;

  constructor(private snackBar: MatSnackBar) {
    this.isAlreadyDownloadedWalletBackupFile = false;
    this.isAlreadyDownloadedPublicWalletFile = false;
  }

  ngOnInit(): void {}

  downloadWalletBackupFile(): void {
    if (!this.privateWallet) {
      this.snackBar.open('Unexpected Error! Reload this page and retry again.', 'Close');
      return;
    }
    if (this.isAlreadyDownloadedWalletBackupFile) {
      this.snackBar.open('You have already download the file!', 'Close');
      return;
    }

    const walletBackupFileName = `wallet-backup-file-${this.privateWallet.id}.txt`;
    const walletBackupJsonString = JSON.stringify(this.privateWallet, null, 2);
    const walletBackupLink = document.createElement('a');
    walletBackupLink.href = 'data:text/plain,' + encodeURIComponent(walletBackupJsonString);
    walletBackupLink.download = walletBackupFileName;
    walletBackupLink.click();

    this.isAlreadyDownloadedWalletBackupFile = true;
  }

  downloadPublicWalletFile(): void {
    if (!this.privateWallet) {
      this.snackBar.open('Unexpected Error! Reload this page and retry again.', 'Close');
      return;
    }
    if (this.isAlreadyDownloadedPublicWalletFile) {
      this.snackBar.open('You have already download the file!', 'Close');
      return;
    }
    if (!this.isAlreadyDownloadedWalletBackupFile) {
      this.snackBar.open('You need to download wallet backup file on step 1!', 'Close');
      return;
    }

    const publicWalletUploadFileName = `public-wallet-upload-file-${this.privateWallet.id}.txt`;
    const publicWalletUploadJson: StoredWallet = {
      id: this.privateWallet.id,
      type: this.privateWallet.type,
      key_type: this.privateWallet.key_type,
      public_key: this.privateWallet.public_key,
      address: this.privateWallet.address,
    };
    const publicWalletUploadJsonString = JSON.stringify(publicWalletUploadJson, null, 2);
    const publicWalletUploadLink = document.createElement('a');
    publicWalletUploadLink.href =
      'data:text/plain,' + encodeURIComponent(publicWalletUploadJsonString);
    publicWalletUploadLink.download = publicWalletUploadFileName;
    publicWalletUploadLink.click();

    this.isAlreadyDownloadedPublicWalletFile = true;

    this.snackBar.open('Download files successfully completed.', undefined, { duration: 3000 });
  }
}
