import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import Decimal from 'decimal.js';
// import { QueryApi } from '@cosmos-client/core/esm/openapi';
import Long from 'long';
import { Observable, zip } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import { denomExponentMap } from './bank.model';

declare const QueryApi: any | { balance(address: string, denom: string): Promise<any> };

@Injectable({ providedIn: 'root' })
export class BankQueryService {
  private restSdk$: Observable<cosmosclient.CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }

  getBalance$(
    address: string,
    denoms?: string[],
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]> {
    if (!denoms) {
      return this.restSdk$.pipe(
        mergeMap((sdk) =>
          cosmosclient.rest.bank.allBalances(sdk, cosmosclient.AccAddress.fromString(address)),
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
              const denomExponent = denomExponentMap[b.denom];
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
    const metadatas: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[] = [
      {
        description: 'The governance token of UnUniFi protocol.',
        denom_units: [
          {
            denom: 'uguu',
            exponent: 0,
          },
          {
            denom: 'guu',
            exponent: 6,
          },
        ],
        base: 'uguu',
        name: 'UnUniFi',
        display: 'guu',
        symbol: 'GUU',
      },
      {
        description: 'The first cryptocurrency invented in 2008',
        denom_units: [
          {
            denom: 'ubtc',
            exponent: 0,
            aliases: [],
          },
          {
            denom: 'btc',
            exponent: 6,
            aliases: [],
          },
        ],
        base: 'ubtc',
        display: 'BTC',
        name: 'Bitcoin',
        symbol: 'BTC',
      },
      {
        description: 'The currency of the U.S.A.',
        denom_units: [
          {
            denom: 'uusd',
            exponent: 0,
            aliases: [],
          },
          {
            denom: 'usd',
            exponent: 6,
            aliases: [],
          },
        ],
        base: 'uusd',
        display: 'USD',
        name: 'US Dollar',
        symbol: 'USD',
      },
      {
        description: 'Stablecoin pegged to the USD',
        denom_units: [
          {
            denom: 'uusdc',
            exponent: 0,
            aliases: [],
          },
          {
            denom: 'uusdc',
            exponent: 6,
            aliases: [],
          },
        ],
        base: 'uusdc',
        display: 'USDC',
        name: 'USD Coin',
        symbol: 'USDC',
      },
      {
        description: 'Decentralized Liquidity Provider Token',
        denom_units: [
          {
            denom: 'udlp',
            exponent: 0,
            aliases: [],
          },
          {
            denom: 'dlp',
            exponent: 6,
            aliases: [],
          },
        ],
        base: 'udlp',
        display: 'DLP',
        name: 'Liquidity Provider',
        symbol: 'DLP',
      },
      {
        description: 'uosmo IBC denom',
        denom_units: [
          {
            denom: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
            exponent: 0,
            aliases: [],
          },
        ],
        base: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
        display: 'osmo',
        name: 'OSMOSIS (IBC)',
        symbol: 'OSMO',
      },
    ];

    for (let i = 0; i < 100; i++) {
      metadatas.push({
        description: 'Yield Aggregator Vault #' + i + 'Token',
        denom_units: [
          {
            denom: 'yield-aggregator/vaults/' + i,
            exponent: 6,
            aliases: [],
          },
        ],
        base: 'yield-aggregator/vaults/' + i,
        display: 'YA-Vault-' + i,
        name: 'YA Vault #' + i,
        symbol: 'YA-VAULT-' + i,
      });
    }

    return {
      data: {
        metadatas,
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
        symbol: 'OSMO',
        image: 'assets/osmosis-logo.svg',
      },
    ];
    return symbolImages;
  }

  // TODO: remove this after metadata is embed in bank module
  async _denomMetadata(denom: string) {
    const metadata = await this._denomsMetadata().then((res) =>
      res.data.metadatas.find((m) => m.base === denom),
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
      return res.data.metadatas || [];
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
        map((res) => res.data.metadatas || []),
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
        const map: { [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata } = {};
        for (const m of metadata) {
          map[m.symbol || ''] = m;
        }

        return map;
      }),
    );
  }
}
