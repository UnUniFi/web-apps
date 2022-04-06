import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

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
  config: Config;
  config$: Observable<Config | undefined>;
  configSubject$: BehaviorSubject<Config | undefined>;
  constructor() {
    this.configs = configs;
    this.config = configs[Math.floor(Math.random() * configs.length)];
    this.configSubject$ = new BehaviorSubject<Config | undefined>(undefined);
    this.configSubject$.next(this.config);
    this.config$ = this.configSubject$.asObservable();
  }

  async setCurrentConfig(configID: string) {
    const selectedConfig = this.configs.find((config) => config.id == configID);
    this.configSubject$.next(selectedConfig);
  }
}
