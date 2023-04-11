import { CosmosSDKService } from '../cosmos-sdk.service';
import { Injectable } from '@angular/core';
import { CosmosSDK } from '@cosmos-client/core/cjs/sdk';
import { Observable } from 'rxjs';
import { map, mergeMap, pluck } from 'rxjs/operators';
import ununificlient from 'ununifi-client';
import {
  ExemplaryTraderAll200ResponseExemplaryTraderInner,
  ExemplaryTraderTracing200ResponseTracingInner,
} from 'ununifi-client/esm/openapi';

@Injectable({ providedIn: 'root' })
export class CopyTradingQueryService {
  private restSdk$: Observable<CosmosSDK>;

  constructor(private cosmosSDK: CosmosSDKService) {
    this.restSdk$ = this.cosmosSDK.sdk$.pipe(pluck('rest'));
  }

  listExemplaryTraders$(): Observable<ExemplaryTraderAll200ResponseExemplaryTraderInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.copyTrading.exemplaryTraderAll(sdk)),
      map((res) => res.data.exemplaryTrader!),
    );
  }

  getExemplaryTrader$(
    address: string,
  ): Observable<ExemplaryTraderAll200ResponseExemplaryTraderInner> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.copyTrading.exemplaryTrader(sdk, address)),
      map((res) => res.data.exemplaryTrader!),
    );
  }

  listTracingsExemplaryTrader$(
    address: string,
  ): Observable<ExemplaryTraderTracing200ResponseTracingInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.copyTrading.exemplaryTraderTracing(sdk, address)),
      map((res) => res.data.tracing!),
    );
  }

  listAllTracings$(): Observable<ExemplaryTraderTracing200ResponseTracingInner[]> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.copyTrading.tracingAll(sdk)),
      map((res) => res.data.tracing!),
    );
  }

  getTracing$(address: string): Observable<ExemplaryTraderTracing200ResponseTracingInner> {
    return this.restSdk$.pipe(
      mergeMap((sdk) => ununificlient.rest.copyTrading.tracing(sdk, address)),
      map((res) => res.data.tracing!),
    );
  }
}
