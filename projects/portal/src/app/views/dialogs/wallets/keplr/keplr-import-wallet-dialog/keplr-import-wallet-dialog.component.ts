import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { cosmosclient } from '@cosmos-client/core';
import * as crypto from 'crypto';
import { KeyType } from 'projects/portal/src/app/models/keys/key.model';
import { KeplrApplicationService } from 'projects/portal/src/app/models/wallets/keplr/keplr.application.service';
import { StoredWallet, WalletType } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { createCosmosPublicKeyFromUint8Array } from 'projects/portal/src/app/utils/key';

@Component({
  selector: 'view-keplr-import-wallet-dialog',
  templateUrl: './keplr-import-wallet-dialog.component.html',
  styleUrls: ['./keplr-import-wallet-dialog.component.css'],
})
export class KeplrImportWalletDialogComponent implements OnInit {
  storedWallet$: Promise<StoredWallet | null | undefined>;
  currentStoredWallet$: Promise<StoredWallet | null | undefined>;

  constructor(
    private readonly walletService: WalletService,
    private readonly keplrAppService: KeplrApplicationService,
    private readonly dialogRef: MatDialogRef<KeplrImportWalletDialogComponent>,
  ) {
    this.storedWallet$ = this.keplrAppService.getKey().then((key) => {
      if (!key) {
        console.error('Fail.');
        return undefined;
      }
      const cosmosPublicKey = createCosmosPublicKeyFromUint8Array(KeyType.secp256k1, key.pubKey);
      if (!cosmosPublicKey) {
        console.error('Invalid Pubkey.');
        return;
      }
      const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
      const pubkey = Buffer.from(cosmosPublicKey.bytes()).toString('hex');
      const storedWallet: StoredWallet = {
        id: key.name,
        type: WalletType.keplr,
        key_type: KeyType.secp256k1,
        public_key: pubkey,
        address: accAddress.toString(),
      };
      return storedWallet;
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
