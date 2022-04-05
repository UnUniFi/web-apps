import { ConfigService } from './config.service';
import { ConfigStoreService } from './config.store.service';
import { Injectable } from '@angular/core';
import { cosmosclient } from '@cosmos-client/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CosmosSDKService {
  restURL$: Observable<string>;
  websocketURL$: Observable<string>;
  chainID$: Observable<string>;
  sdk$: Observable<{ rest: cosmosclient.CosmosSDK; websocket: cosmosclient.CosmosSDK }>;

  constructor(
    private readonly config: ConfigService,
    private readonly configStore: ConfigStoreService,
  ) {
    this.configStore.currentConfig$.asObservable().pipe(
      map((config) => {
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
      }),
    );

    this.restURL$ = this.configStore.currentConfig$
      .asObservable()
      .pipe(map((config) => config?.restURL!));
    this.websocketURL$ = this.configStore.currentConfig$
      .asObservable()
      .pipe(map((config) => config?.websocketURL!));
    this.chainID$ = this.configStore.currentConfig$
      .asObservable()
      .pipe(map((config) => config?.chainID!));
    this.sdk$ = combineLatest([this.restURL$, this.websocketURL$, this.chainID$]).pipe(
      map(([restURL, websocketURL, chainID]) => ({
        rest: new cosmosclient.CosmosSDK(restURL, chainID),
        websocket: new cosmosclient.CosmosSDK(websocketURL, chainID),
      })),
    );
  }

  sdk() {
    return this.sdk$.pipe(first()).toPromise();
  }
}
