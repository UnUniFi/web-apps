import { Inject, Injectable } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configSubject$: BehaviorSubject<Config>;
  configs: Config[];

  get config$(): Observable<Config> {
    return this.configSubject$.asObservable();
  }

  constructor(@Inject('configs') configs: Config[]) {
    this.configs = configs;
    const randomConfig = this.configs[Math.floor(Math.random() * this.configs.length)];
    this.configSubject$ = new BehaviorSubject<Config>(randomConfig);
  }

  async setCurrentConfig(configID: string) {
    const selectedConfig = this.configs.find((config) => config.id == configID);
    if (!selectedConfig) {
      throw new Error(`Config with id ${configID} not found`);
    }
    this.configSubject$.next(selectedConfig);
  }
}
