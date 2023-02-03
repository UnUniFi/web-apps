import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import Long from 'long';
import { Observable, of } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class BankQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }

  getBalance$(
    address: string,
    denoms?: string[],
  ): Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]> {
    if (!denoms) {
      return this.restSdk$.pipe(
        mergeMap((sdk) => of({ data: null as any })),
        map((res) => res.data.metadata!),
      );
    }

    return this.restSdk$.pipe(
      mergeMap((sdk) => of({ data: null as any })),
      map((res) => res.data.metadata!),
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
        balance.forEach((b) => {
          if (b.denom) {
            map[b.denom] = b;
          }
        });
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
    return this.getBalance$(address, denoms).pipe(
      mergeMap((balance) =>
        this.getDenomMetadataMap$(denoms).pipe(map((metadataMap) => ({ balance, metadataMap }))),
      ),
      mergeMap(async ({ balance, metadataMap }) => {
        const map: { [symbol: string]: number } = {};
        await Promise.all(
          balance.map((b) => {
            const metadata = metadataMap[b.denom!];
            const denomUnit = metadata.denom_units?.find((u) => u.denom === b.denom);

            if (denomUnit) {
              map[metadata.symbol!] = Long.fromString(b.amount!)
                .div(10 ** denomUnit.exponent!)
                .toNumber();
            }
          }),
        );

        return map;
      }),
    );
  }

  getDenomMetadata$(
    denoms?: string[],
  ): Observable<cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[]> {
    if (!denoms) {
      return this.restSdk$.pipe(
        mergeMap((sdk) => of({ data: null as any })),
        map((res) => res.data.metadata!),
      );
    }

    return this.restSdk$.pipe(
      mergeMap((sdk) => of({ data: null as any })),
      map((res) => res.data.metadata!),
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
