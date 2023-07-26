import { WalletType } from './../../../../models/wallets/wallet.model';
import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-connect-wallet-start-dialog',
  templateUrl: './connect-wallet-start-dialog.component.html',
  styleUrls: ['./connect-wallet-start-dialog.component.css'],
})
export class ConnectWalletStartDialogComponent implements OnInit {
  walletOptions = [
    {
      logo: 'assets/keplr-logo.svg',
      walletType: WalletType.keplr,
      name: 'Keplr',
    },
    {
      logo: 'assets/favicon.png',
      walletType: WalletType.ununifi,
      name: 'UnUniFi',
    },
    // {
    //   logo: 'assets/metamask-logo.svg',
    //   walletType: WalletType.metaMask,
    //   name: 'MetaMask',
    // },
  ];

  constructor(public dialogRef: DialogRef<WalletType, ConnectWalletStartDialogComponent>) {}

  ngOnInit(): void {}

  onClickButton(walletType: WalletType): void {
    this.dialogRef.close(walletType);
  }

  onClickClose() {
    this.dialogRef.close();
  }
}
