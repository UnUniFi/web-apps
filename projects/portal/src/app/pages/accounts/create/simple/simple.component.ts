import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import * as bip39 from 'bip39';
import { KeyType } from 'projects/portal/src/app/models/keys/key.model';
import { StoredWallet, WalletType } from 'projects/portal/src/app/models/wallets/wallet.model';
import {
  createCosmosPrivateKeyFromString,
  createPrivateKeyStringFromMnemonic,
} from 'projects/portal/src/app/utils/key';

@Component({
  selector: 'app-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css'],
})
export class SimpleComponent implements OnInit {
  privateWallet$: Promise<StoredWallet & { mnemonic: string; privateKey: string }>;
  now = new Date();

  constructor() {
    const mnemonic = bip39.generateMnemonic();
    this.privateWallet$ = createPrivateKeyStringFromMnemonic(mnemonic).then((privateKey) => {
      if (!privateKey) {
        throw Error('Invalid mnemonic!');
      }
      const cosmosPrivateKey = createCosmosPrivateKeyFromString(KeyType.secp256k1, privateKey);
      if (!cosmosPrivateKey) {
        throw Error('Invalid privateKey!');
      }
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
