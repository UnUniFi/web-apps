import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { WalletType } from 'projects/portal/src/app/models/wallets/wallet.model';

@Component({
  selector: 'app-connect-wallet-start-dialog',
  templateUrl: './connect-wallet-start-dialog.component.html',
  styleUrls: ['./connect-wallet-start-dialog.component.css'],
})
export class ConnectWalletStartDialogComponent implements OnInit {
  walletTypeOptions = Object.values(WalletType);

  constructor(public matDialogRef: MatDialogRef<ConnectWalletStartDialogComponent>) {}

  ngOnInit(): void {}

  onClickButton(walletType: WalletType): void {
    this.matDialogRef.close(walletType);
  }
}
