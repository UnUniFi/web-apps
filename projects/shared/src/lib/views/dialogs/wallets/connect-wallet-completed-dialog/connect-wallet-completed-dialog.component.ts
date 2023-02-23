import { StoredWallet } from '../../../../../lib/models/wallets/wallet.model';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import * as crypto from 'crypto';

@Component({
  selector: 'view-connect-wallet-completed-dialog',
  templateUrl: './connect-wallet-completed-dialog.component.html',
  styleUrls: ['./connect-wallet-completed-dialog.component.css'],
})
export class ConnectWalletCompletedDialogComponent implements OnInit {
  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: StoredWallet,
    private readonly dialogRef: DialogRef<ConnectWalletCompletedDialogComponent>,
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
