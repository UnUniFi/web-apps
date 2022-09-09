import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type Denom = 'uguu' | 'ubtc' | 'jpu' | 'ueth' | 'euu';

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
    denom: Denom;
    amount: string;
  }[];
  extension?: {
    faucet?: {
      hasFaucet: boolean;
      faucetURL: string;
      denom: Denom;
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

type PortMap = {
  rest: number;
  websocket: number;
  ubtc: number;
  uguu: number;
  jpu: number;
  ueth: number;
  euu: number;
};

type Port = Record<'http:' | 'https:', PortMap>;

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private configSubject$: BehaviorSubject<Config>;
  configs: Config[];

  get config$(): Observable<Config> {
    return this.configSubject$.asObservable().pipe(map((config) => convert(config, this.port)));
  }

  constructor(@Inject('configs') configs: Config[], @Inject('port') private port: Port) {
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

function convert(config: Config, port: Port): Config {
  // @ts-ignore
  const portMap = port[location.protocol];
  const protocols =
    location.protocol === 'https:' ? { http: 'https:', ws: 'wss:' } : { http: 'http:', ws: 'ws:' };

  const restURL = config.restURL.replace(/^https?:/, protocols.http);
  const websocketURL = config.websocketURL.replace(/^wss?:/, protocols.ws);

  const faucet =
    config.extension?.faucet?.map((f) => {
      const faucetURL = f.faucetURL.replace(/^https?:/, protocols.http);
      return {
        ...f,
        faucetURL: faucetURL + `:${portMap[f.denom]}`,
      };
    }) ?? [];

  return {
    ...config,
    restURL: restURL + `:${portMap.rest}`,
    websocketURL: websocketURL + `:${portMap.websocket}`,
    extension: config.extension ? { ...config.extension, faucet } : undefined,
  };
}
