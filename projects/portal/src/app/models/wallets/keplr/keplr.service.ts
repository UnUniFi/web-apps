import { ConfigService } from '../../config.service';
import { Injectable } from '@angular/core';
import { AccountData } from '@cosmjs/launchpad';
import { Key, Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

@Injectable({
  providedIn: 'root',
})
export class KeplrService {
  constructor(private configService: ConfigService) {}

  async getAccounts(): Promise<readonly AccountData[] | undefined> {
    if (!window.keplr) {
      alert('Please install keplr extension');
      return;
    } else {
      const config = await this.configService.config$.toPromise().then((config) => config);
      await window.keplr?.enable(config?.chainID!);
      const offlineSigner = window.keplr?.getOfflineSigner(config?.chainID!);

      return offlineSigner?.getAccounts();
    }
  }

  async getKey(): Promise<Key | undefined> {
    if (!window.keplr) {
      alert('Please install keplr extension');
      return;
    } else {
      const config = await this.configService.config$.toPromise().then((config) => config);
      await window.keplr?.enable(config?.chainID!);
      const key = await window.keplr?.getKey(config?.chainID!);
      return key;
      // const pubkey = createCosmosPublicKeyFromUint8Array(KeyType.secp256k1, key.pubKey);
      // return cosmosclient.AccAddress.fromPublicKey(pubkey!);
    }
  }
}
