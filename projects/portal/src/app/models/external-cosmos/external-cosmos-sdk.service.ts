import { ChainInfo, ConfigService } from '../config.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { first, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExternalCosmosSdkService {
  constructor(private readonly configS: ConfigService) {}

  async chainInfo(id: string): Promise<ChainInfo | undefined> {
    const chain$ = this.configS.config$.pipe(
      map((config) => config?.externalChains.find((chain) => chain.id === id)),
    );
    return chain$.pipe(first()).toPromise();
  }

  async sdk(
    id: string,
  ): Promise<{ rest: cosmosclient.CosmosSDK; websocket: cosmosclient.CosmosSDK }> {
    const chain$ = this.configS.config$.pipe(
      map((config) => config?.externalChains.find((chain) => chain.id === id)),
    );
    const sdk$ = chain$.pipe(
      map((chain) => {
        if (!chain) {
          throw new Error('chain not found');
        }
        return {
          rest: new cosmosclient.CosmosSDK(chain.rest, chain.chainId),
          websocket: new cosmosclient.CosmosSDK(chain.rpc, chain.chainId),
        };
      }),
    );
    return sdk$.pipe(first()).toPromise();
  }

  setBech32PrefixToCosmosclient(chain: ChainInfo) {
    cosmosclient.config.setBech32Prefix({
      accAddr: chain.bech32Config.bech32PrefixAccAddr,
      accPub: chain.bech32Config.bech32PrefixAccPub,
      valAddr: chain.bech32Config.bech32PrefixValAddr,
      valPub: chain.bech32Config.bech32PrefixValPub,
      consAddr: chain.bech32Config.bech32PrefixConsAddr,
      consPub: chain.bech32Config.bech32PrefixConsPub,
    });
  }
}
