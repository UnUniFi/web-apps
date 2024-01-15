import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Config = {
  id: string;
  name: string;
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
  apps: AppNavigation[];
  denomMetadata: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[];
  strategiesInfo: StrategyInfo[];
  certifiedVaults: string[];
  externalChains: ChainInfo[];
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

export type AppNavigation = {
  name: string;
  link: string;
  icon: string;
};

export type StrategyInfo = {
  id: string;
  denom?: string;
  name?: string;
  description?: string;
  gitURL?: string;
  minApy: number;
  maxApy?: number;
  certainty: boolean;
  unbondingTimeSec?: string;
  poolInfo?:
    | {
        type: 'osmosis';
        poolId: string;
        apr?: number;
      }
    | {
        type: 'osmosis_multi';
        pools: { id: string; weight: string }[];
      }
    | {
        type: 'astroport';
      };
};

export type ChainInfo = {
  id: string;
  chainId: string;
  chainName: string;
  rpc: string;
  rest: string;
  bip44: { coinType: number };
  bech32Config: {
    bech32PrefixAccAddr: string;
    bech32PrefixAccPub: string;
    bech32PrefixValAddr: string;
    bech32PrefixValPub: string;
    bech32PrefixConsAddr: string;
    bech32PrefixConsPub: string;
  };
  currencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
  }[];
  feeCurrencies: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
  }[];
  stakeCurrency: {
    coinDenom: string;
    coinMinimalDenom: string;
    coinDecimals: number;
    coinGeckoId: string;
  };
  gasPriceStep: {
    low: number;
    average: number;
    high: number;
  };
  features?: string[];
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
