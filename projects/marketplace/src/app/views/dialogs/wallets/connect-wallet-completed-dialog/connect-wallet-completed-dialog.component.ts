import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as crypto from 'crypto';
import { StoredWallet } from 'projects/marketplace/src/app/models/wallets/wallet.model';

@Component({
  selector: 'view-connect-wallet-completed-dialog',
  templateUrl: './connect-wallet-completed-dialog.component.html',
  styleUrls: ['./connect-wallet-completed-dialog.component.css'],
})
export class ConnectWalletCompletedDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public readonly data: StoredWallet,
    private readonly dialogRef: MatDialogRef<ConnectWalletCompletedDialogComponent>,
  ) {}

  ngOnInit(): void {}

  getColorCode(storedWallet: StoredWallet) {
    const hash = crypto
      .createHash('sha256')
      .update(Buffer.from(storedWallet.id))
      .digest()
      .toString('hex');
    return `#${hash.substr(0, 6)}`;
  }

  onClickButton() {
    this.dialogRef.close();
  }
}
