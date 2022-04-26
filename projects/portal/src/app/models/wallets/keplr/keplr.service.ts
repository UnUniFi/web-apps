import { createCosmosPublicKeyFromUint8Array } from '../../../utils/key';
import { ConfigService } from '../../config.service';
import { KeyType } from '../../keys/key.model';
import { AccountData, SigningCosmosClient } from '@cosmjs/launchpad';
import { cosmosclient } from '@cosmos-client/core';
import { Window as KeplrWindow } from '@keplr-wallet/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export interface keplrKey {
  // Name of the selected key store.
  name: string;
  algo: string;
  pubKey: Uint8Array;
  address: Uint8Array;
  bech32Address: string;
  isNanoLedger: boolean;
}

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

  async getAddress(): Promise<cosmosclient.AccAddress | undefined> {
    if (!window.keplr) {
      alert('Please install keplr extension');
      return;
    } else {
      const config = await this.configService.config$.toPromise().then((config) => config);
      await window.keplr?.enable(config?.chainID!);
      const key = await window.keplr?.getKey(config?.chainID!);
      const pubkey = createCosmosPublicKeyFromUint8Array(KeyType.secp256k1, key.pubKey);
      return cosmosclient.AccAddress.fromPublicKey(pubkey!);
    }
  }
}
