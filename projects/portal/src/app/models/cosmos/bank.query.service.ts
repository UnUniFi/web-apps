import { ConfigService } from '../config.service';
import { CosmosSDKService } from '../cosmos-sdk.service';
import { getDenomExponent } from './bank.model';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import Decimal from 'decimal.js';
// import { QueryApi } from '@cosmos-client/core/esm/openapi';
import { Observable, zip } from 'rxjs';
import { map, mergeMap, pluck, take } from 'rxjs/operators';

declare const QueryApi: any | { balance(address: string, denom: string): Promise<any> };

@Injectable({ providedIn: 'root' })
export class BankQueryService {
  private restSdk$: Observable<cosmosclient.CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService, private readonly configS: ConfigService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }

  getSupply$(denom: string): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.bank.supplyOf(sdk, denom)),
      map((res) => res.data.amount!),
    );
  }

  getBalance$(
    address: string,
    denoms?: string[],
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]> {
    if (!denoms) {
      return this.restSdk$.pipe(
        mergeMap((sdk) =>
          cosmosclient.rest.bank.allBalances(sdk, address),
        ),
        map((res) => res.data.balances || []),
      );
    }

    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        Promise.all(
          denoms.map(
            (denom) =>
              new QueryApi(undefined, sdk.url)
                .balance(address, denom)
                .then((res: any) => res.data.balance!), // TODO: remove any
          ),
        ),
      ),
    );
  }

  getDenomBalanceMap$(
    address: string,
    denoms?: string[],
  ): Observable<{
    [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin;
  }> {
    return this.getBalance$(address, denoms).pipe(
      map((balance) => {
        const map: { [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin } = {};
        for (const b of balance) {
          map[b.denom || ''] = b;
        }
        return map;
      }),
    );
  }

  getSymbolBalanceMap$(
    address: string,
    denoms?: string[],
  ): Observable<{
    [symbol: string]: number;
  }> {
    return zip(this.getBalance$(address, denoms), this.getDenomMetadataMap$(denoms)).pipe(
      mergeMap(async ([balance, metadataMap]) => {
        const map: { [symbol: string]: number } = {};
        await Promise.all(
          balance.map(async (b) => {
            if (b.denom && b.amount) {
              const metadata = metadataMap[b.denom];
              if (!metadata) {
                return;
              }
              const denomExponent = getDenomExponent(b.denom);
              const amount = new Decimal(b.amount);
              map[metadata.symbol!] = Number(
                amount.dividedBy(new Decimal(10 ** denomExponent)).toFixed(6),
              );
            }
          }),
        );

        return map;
      }),
    );
  }

  getSymbolDisplayMap$(denoms?: string[]) {
    return this.getDenomMetadata$(denoms).pipe(
      map((metadata) => {
        const map: { [symbol: string]: string } = {};
        for (const m of metadata) {
          map[m.symbol || ''] = m.display!;
        }
        return map;
      }),
    );
  }

  getSymbolImageMap(symbols?: string[]): {
    [symbol: string]: string;
  } {
    const map: { [symbol: string]: string } = {};
    const images = this.symbolImages();
    if (!symbols) {
      for (const img of images) {
        map[img.symbol] = img.image;
      }
    } else {
      for (const s of symbols) {
        const img = images.find((i) => i.symbol === s);
        map[s] = img?.image || '';
      }
    }
    return map;
  }

  // TODO: remove this after metadata is embed in bank module
  async _denomsMetadata() {
    const config = await this.configS.config$.pipe(take(1)).toPromise();
    const metadata = config?.denomMetadata || [];
    for (let i = 0; i < 100; i++) {
      metadata?.push({
        description: 'Yield Aggregator Vault #' + i + 'Token',
        denom_units: [
          {
            denom: 'yieldaggregator/vaults/' + i,
            exponent: 6,
            aliases: [],
          },
        ],
        base: 'yieldaggregator/vaults/' + i,
        display: 'YA-Vault-' + i,
        name: 'YA Vault #' + i,
        symbol: 'YA-VAULT-' + i,
      });
    }
    return {
      data: {
        metadata,
      },
    };
  }

  symbolImages() {
    const symbolImages = [
      {
        symbol: 'GUU',
        image: 'assets/UnUniFi-logo.png',
      },
      {
        symbol: 'BTC',
        image:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg',
      },
      {
        symbol: 'ETH',
        image:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg',
      },
      {
        symbol: 'USDC',
        image:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg',
      },
      {
        symbol: 'ATOM',
        image:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg',
      },
      {
        symbol: 'ATOM (from Osmosis)',
        image:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg',
      },
      {
        symbol: 'OSMO',
        image: 'assets/osmosis-logo.svg',
      },
    ];
    return symbolImages;
  }

  // TODO: remove this after metadata is embed in bank module
  async _denomMetadata(denom: string) {
    const metadata = await this._denomsMetadata().then((res) =>
      res.data.metadata.find((m) => m.base === denom),
    );

    return {
      data: {
        metadata,
      },
    };
  }

  async getDenomMetadata(
    denoms?: string[],
  ): Promise<cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[]> {
    const sdk = await this.cosmosSDK.sdk().then((sdk) => sdk.rest);
    if (!denoms) {
      const res = await this._denomsMetadata();
      return res.data.metadata || [];
    }

    const res = await Promise.all(
      denoms.map((denom) => this._denomMetadata(denom).then((res) => res.data.metadata!)),
    );
    return res;
  }

  getDenomMetadata$(
    denoms?: string[],
  ): Observable<cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[]> {
    if (!denoms) {
      return this.restSdk$.pipe(
        mergeMap((sdk) => this._denomsMetadata()),
        map((res) => res.data.metadata || []),
      );
    }

    return this.restSdk$.pipe(
      mergeMap((sdk) =>
        Promise.all(
          denoms.map((denom) => this._denomMetadata(denom).then((res) => res.data.metadata!)),
        ),
      ),
    );
  }

  getDenomMetadataMap$(
    denoms?: string[],
  ): Observable<{ [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata }> {
    return this.getDenomMetadata$(denoms).pipe(
      map((metadata) => {
        const map: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } = {};
        for (const m of metadata) {
          map[m.base || ''] = m;
        }

        return map;
      }),
    );
  }

  getSymbolMetadataMap$(
    denoms?: string[],
  ): Observable<{ [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata }> {
    return this.getDenomMetadata$(denoms).pipe(
      map((metadata) => {
        const map: { [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } = {};
        for (const m of metadata) {
          map[m.symbol || ''] = m;
        }

        return map;
      }),
    );
  }
}
