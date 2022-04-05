import { KeyStoreService } from './keys/key.store.service';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';

export type Config = {
  id: string;
  restURL: string;
  websocketURL: string;
  chainID: string;
  bech32Prefix?: {
    accAddr: string;
    accPub: string;
    valAddr: string;
    valPub: string;
    consAddr: string;
    consPub: string;
  };
  minimumGasPrices: {
    denom: string;
    amount: string;
  }[];
  extension?: {
    faucet?: {
      hasFaucet: boolean;
      faucetURL: string;
      denom: string;
      creditAmount: number;
      maxCredit: number;
    }[];
    monitor?: {
      monitorURL: string;
    };
    navigations: {
      name: string;
      link: string;
      icon: string;
    }[];
    messageModules: string[];
  };
};

declare const configs: Config[];

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  configs: Config[];
  constructor(private readonly keyStore: KeyStoreService) {
    this.configs = configs;
  }
}
