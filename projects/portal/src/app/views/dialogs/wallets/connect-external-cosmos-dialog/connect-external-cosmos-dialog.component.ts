import { WalletType } from '../../../../models/wallets/wallet.model';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-connect-external-cosmos-dialog',
  templateUrl: './connect-external-cosmos-dialog.component.html',
  styleUrls: ['./connect-external-cosmos-dialog.component.css'],
})
export class ConnectExternalCosmosDialogComponent implements OnInit {
  walletOptions?: { logo: string; walletType: WalletType; name: string }[];

  constructor(
    @Inject(DIALOG_DATA)
    public readonly data: string,
    public dialogRef: DialogRef<WalletType, ConnectExternalCosmosDialogComponent>,
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
  }

  ngOnInit(): void {}

  onClickButton(walletType: WalletType): void {
    this.dialogRef.close(walletType);
  }

  onClickClose() {
    this.dialogRef.close();
  }
}
