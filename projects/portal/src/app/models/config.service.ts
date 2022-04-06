import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
  config: Config;
  config$: Observable<Config | undefined>;
  configs: Config[];
  constructor() {
    this.configs = configs;
    this.config = configs[Math.floor(Math.random() * configs.length)];
    this.config$ = of(configs[Math.floor(Math.random() * configs.length)]);
  }
}
