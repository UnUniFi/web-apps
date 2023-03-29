import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import Decimal from 'decimal.js';
// import { QueryApi } from '@cosmos-client/core/esm/openapi';
import Long from 'long';
import { Observable, zip } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';

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
            const metadata = metadataMap[b.denom!];
            const denomUnit = metadata.denom_units?.find((u) => u.denom === b.denom);

            if (denomUnit) {
              const amount = new Decimal(b.amount!);
              map[metadata.symbol!] = Number(
                amount.dividedBy(new Decimal(10 ** denomUnit.exponent!)).toFixed(6),
              );
            }
          }),
        );

        return map;
      }),
    );
  }

  // TODO: remove this after metadata is embed in bank module
  async _denomsMetadata() {
    const metadatas: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[] = [
      {
        description: 'UnUniFi governance token',
        denom_units: [
          {
            denom: 'uguu',
            exponent: 6,
            aliases: [],
          },
        ],
        base: 'uguu',
        display: 'GUU',
        name: 'UnUniFi',
        symbol: 'GUU',
      },
      {
        description: 'The first cryptocurrency invented in 2008',
        denom_units: [
          {
            denom: 'ubtc',
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
            denom: 'uosmo',
            exponent: 6,
            aliases: [],
          },
        ],
        base: 'ibc/ED07A3391A112B175915CD8FAF43A2DA8E4790EDE12566649D0C2F97716B8518',
        display: 'OSMO',
        name: 'OSMOSIS (IBC)',
        symbol: 'OSMO',
      },
      {
        description: 'UnUniFi Stake Token',
        denom_units: [
          {
            denom: 'stake',
            exponent: 6,
            aliases: [],
          },
        ],
        base: 'stake',
        display: 'GUU ',
        name: 'GUU (stake)',
        symbol: 'GUU ',
      },
    ];

    return {
      data: {
        metadatas,
      },
    };
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
