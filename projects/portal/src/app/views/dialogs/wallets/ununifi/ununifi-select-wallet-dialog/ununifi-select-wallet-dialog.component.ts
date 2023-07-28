import { StoredWallet, WalletType } from './../../../../../models/wallets/wallet.model';
import { WalletService } from './../../../../../models/wallets/wallet.service';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import * as crypto from 'crypto';

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
    private readonly dialogRef: DialogRef<StoredWallet, UnunifiSelectWalletDialogComponent>,
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

  onClickClose() {
    this.dialogRef.close();
  }
}
