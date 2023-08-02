import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Config = {
  id: string;
  restURL: string;
  websocketURL: string;
  chainID: string;
  chainName: string;
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
  denomMetadata: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[];
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
    nftMint?: {
      enabled: boolean;
      nftClasses: string[];
    };
    developer?: {
      enabled: boolean;
      developerURL: string;
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
  config$: Observable<Config | undefined>;
  configSubject$: BehaviorSubject<Config | undefined>;
  constructor() {
    this.configs = configs;
    this.configSubject$ = new BehaviorSubject<Config | undefined>(undefined);
    const configID = localStorage.getItem('configID');
    const selectedConfig = this.configs.find((config) => config.id == configID);
    if (configID && selectedConfig) {
      this.configSubject$.next(selectedConfig);
    } else {
      const randomConfig = configs[Math.floor(Math.random() * configs.length)];
      this.configSubject$.next(randomConfig);
    }
    this.config$ = this.configSubject$.asObservable();
  }

  async setCurrentConfig(configID: string) {
    const selectedConfig = this.configs.find((config) => config.id == configID);
    this.configSubject$.next(selectedConfig);
    localStorage.setItem('configID', configID);
    location.reload();
  }
}
