import { Component, OnInit } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import * as bip39 from 'bip39';
import { KeyService } from 'projects/marketplace/src/app/models';
import { KeyType } from 'projects/marketplace/src/app/models/keys/key.model';
import { StoredWallet, WalletType } from 'projects/marketplace/src/app/models/wallets/wallet.model';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css'],
})
export class SimpleComponent implements OnInit {
  privateWallet$: Promise<StoredWallet & { mnemonic: string; privateKey: string }>;
  now = new Date();

  constructor(private keyService: KeyService) {
    const mnemonic = bip39.generateMnemonic();
    this.privateWallet$ = this.keyService.getPrivateKeyFromMnemonic(mnemonic).then((privateKey) => {
      const cosmosPrivateKey = this.keyService.getPrivKey(
        KeyType.secp256k1,
        Uint8Array.from(Buffer.from(privateKey, 'hex')),
      );
      const cosmosPublicKey = cosmosPrivateKey.pubKey();
      const public_key = Buffer.from(cosmosPublicKey.bytes()).toString('hex');
      const accAddress = cosmosclient.AccAddress.fromPublicKey(cosmosPublicKey);
      const address = accAddress.toString();
      const year = String(this.now.getFullYear());
      const month = String(this.now.getMonth() + 1);
      const date = String(this.now.getDate());
      const hour = String(this.now.getHours());
      const min = String(this.now.getMinutes());
      const sec = String(this.now.getSeconds());
      const id = `${year}${month}${date}${hour}${min}${sec}`;
      return {
        id,
        type: WalletType.ununifi,
        mnemonic,
        key_type: KeyType.secp256k1,
        privateKey,
        public_key,
        address,
      };
    });
  }

  ngOnInit(): void {}
}
