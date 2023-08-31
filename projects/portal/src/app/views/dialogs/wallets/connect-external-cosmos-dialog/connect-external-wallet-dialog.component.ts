import { WalletType } from '../../../../models/wallets/wallet.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'view-connect-external-wallet-dialog',
  templateUrl: './connect-external-wallet-dialog.component.html',
  styleUrls: ['./connect-external-wallet-dialog.component.css'],
})
export class ConnectExternalWalletDialogComponent implements OnInit {
  walletOptions?: { logo: string; walletType: WalletType; name: string }[];

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: string,
    public dialogRef: DialogRef<WalletType, ConnectExternalWalletDialogComponent>,
  ) {
    if (data == 'cosmoshub' || data == 'osmosis' || data == 'neutron' || data == 'sei') {
      this.walletOptions = [
        {
          logo: 'assets/wallets/keplr.svg',
          walletType: WalletType.keplr,
          name: 'Keplr',
        },
        {
          logo: 'assets/wallets/leap.svg',
          walletType: WalletType.leap,
          name: 'Leap',
        },
      ];
    }
    if (data == 'ethereum' || data == 'avalanche' || data == 'polygon' || data == 'arbitrum') {
      this.walletOptions = [
        {
          logo: 'assets/wallets/metamask.svg',
          walletType: WalletType.metamask,
          name: 'MetaMask',
        },
        {
          logo: 'assets/wallets/wallet-connect.svg',
          walletType: WalletType.walletConnect,
          name: 'WalletConnect',
        },
      ];
    }
  }

  ngOnInit(): void {}

  onClickButton(walletType: WalletType): void {
    this.dialogRef.close(walletType);
  }

  onClickClose() {
    this.dialogRef.close();
  }
}
