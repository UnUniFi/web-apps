import { WalletType } from './../../../../models/wallets/wallet.model';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-connect-wallet-start-dialog',
  templateUrl: './connect-wallet-start-dialog.component.html',
  styleUrls: ['./connect-wallet-start-dialog.component.css'],
})
export class ConnectWalletStartDialogComponent implements OnInit {
  walletOptions = [
    {
      logo: 'assets/favicon.png',
      walletType: WalletType.ununifi,
      name: 'UnUniFi',
    },
    {
      logo: 'assets/keplr-logo.svg',
      walletType: WalletType.keplr,
      name: 'Keplr',
    },
    {
      logo: 'assets/ledger-logo.png',
      walletType: WalletType.ledger,
      name: 'Ledger',
    },
    {
      logo: 'assets/key-station-logo.png',
      walletType: WalletType.keyStation,
      name: 'Key Station',
    },
    {
      logo: 'assets/metamask-logo.svg',
      walletType: WalletType.metaMask,
      name: 'MetaMask',
    },
  ];

  constructor(public matDialogRef: MatDialogRef<ConnectWalletStartDialogComponent>) {}

  ngOnInit(): void {}

  onClickButton(walletType: WalletType): void {
    this.matDialogRef.close(walletType);
  }
}
