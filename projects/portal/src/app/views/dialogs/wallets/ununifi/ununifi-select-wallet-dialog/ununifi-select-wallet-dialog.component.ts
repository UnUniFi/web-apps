import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import * as crypto from 'crypto';
import { StoredWallet, WalletType } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';

@Component({
  selector: 'view-ununifi-select-wallet-dialog',
  templateUrl: './ununifi-select-wallet-dialog.component.html',
  styleUrls: ['./ununifi-select-wallet-dialog.component.css'],
})
export class UnunifiSelectWalletDialogComponent implements OnInit {
  storedWallets$: Promise<StoredWallet[] | null | undefined>;
  currentStoredWallet$: Promise<StoredWallet | null | undefined>;

  constructor(
    private readonly walletService: WalletService,
    private readonly dialogRef: MatDialogRef<UnunifiSelectWalletDialogComponent>,
  ) {
    this.storedWallets$ = this.walletService
      .listStoredWallets()
      .then((storedWallets) => {
        const ununifiWallets = storedWallets?.filter(
          (storedWallet) => storedWallet.type === WalletType.ununifi,
        );
        return ununifiWallets;
      })
      .catch((error) => {
        console.error(error);
        return undefined;
      });
    this.currentStoredWallet$ = this.walletService
      .getCurrentStoredWallet()
      .then((currentStoredWallet) => {
        return currentStoredWallet;
      })
      .catch((error) => {
        console.error(error);
        return undefined;
      });
  }

  ngOnInit(): void {}

  getColorCode(storedWallet: StoredWallet) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(storedWallet.id))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }

  onClickWallet(storedWallet: StoredWallet): void {
    this.dialogRef.close(storedWallet);
  }
}
