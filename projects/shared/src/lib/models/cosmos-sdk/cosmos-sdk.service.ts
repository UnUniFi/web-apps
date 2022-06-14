import { Config, ConfigService } from '../config/config.service';
import { Injectable } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CosmosSDKService {
  restURL$: Observable<string>;
  websocketURL$: Observable<string>;
  chainID$: Observable<string>;
  sdk$: Observable<{ rest: cosmosclient.CosmosSDK; websocket: cosmosclient.CosmosSDK }>;

  constructor(private readonly configS: ConfigService) {
    this.restURL$ = this.configS.config$.pipe(map((config) => config?.restURL!));
    this.websocketURL$ = this.configS.config$.pipe(map((config) => config?.websocketURL!));
    this.chainID$ = this.configS.config$.pipe(map((config) => config?.chainID!));
    this.sdk$ = combineLatest([
      this.configS.config$,
      this.restURL$,
      this.websocketURL$,
      this.chainID$,
    ]).pipe(
      map(([config, restURL, websocketURL, chainID]) => {
        if (!config) {
          return {
            rest: new cosmosclient.CosmosSDK(restURL, chainID),
            websocket: new cosmosclient.CosmosSDK(websocketURL, chainID),
          };
        }
        this.setBech32PrefixToCosmosclient(config, restURL, websocketURL, chainID);
        return {
          rest: new cosmosclient.CosmosSDK(restURL, chainID),
          websocket: new cosmosclient.CosmosSDK(websocketURL, chainID),
        };
      }),
    );
  }

  sdk() {
    return this.sdk$.pipe(first()).toPromise();
  }

  isValidPairConfigRestURLWebsocketURLChainID(
    config: Config,
    restURL: string,
    websocketURL: string,
    chainID: string,
  ): boolean {
    if (config.restURL !== restURL) {
      return false;
    }
    if (config.websocketURL !== websocketURL) {
      return false;
    }
    if (config.chainID !== chainID) {
      return false;
    }
    return true;
  }

  setBech32PrefixToCosmosclient(
    config: Config,
    restURL: string,
    websocketURL: string,
    chainID: string,
  ) {
    if (!this.isValidPairConfigRestURLWebsocketURLChainID(config, restURL, websocketURL, chainID)) {
      return;
    }
    if (
      config &&
      config.bech32Prefix?.accAddr &&
      config.bech32Prefix?.accPub &&
      config.bech32Prefix?.valAddr &&
      config.bech32Prefix?.valAddr &&
      config.bech32Prefix?.consAddr &&
      config.bech32Prefix?.consAddr
    ) {
      cosmosclient.config.setBech32Prefix({
        accAddr: config.bech32Prefix?.accAddr,
        accPub: config.bech32Prefix?.accPub,
        valAddr: config.bech32Prefix?.valAddr,
        valPub: config.bech32Prefix?.valAddr,
        consAddr: config.bech32Prefix?.consAddr,
        consPub: config.bech32Prefix?.consAddr,
      });
    }
  }
}
