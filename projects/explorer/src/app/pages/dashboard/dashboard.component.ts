import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { InlineResponse20010 } from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from '@ununifi/shared';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  pollingInterval = 30 * 60;
  latestBlock$: Observable<InlineResponse20010 | undefined>;
  latestBlockHeight$: Observable<bigint | undefined>;
  totalSupply$: Observable<number | undefined>;
  stakedTokens$: Observable<number | undefined>;
  stakedRatio$: Observable<string | undefined>;
  inflation$: Observable<string>;

  constructor(private readonly cosmosSDK: CosmosSDKService) {
    const timer$ = timer(0, this.pollingInterval * 1000);
    // eslint-disable-next-line no-unused-vars
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));
    this.latestBlock$ = sdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.tendermint.getLatestBlock(sdk.rest).then((res) => res.data),
      ),
    );
    this.latestBlockHeight$ = this.latestBlock$.pipe(
      map((latestBlock) =>
        latestBlock?.block?.header?.height ? BigInt(latestBlock.block.header.height) : undefined,
      ),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    this.totalSupply$ = sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.bank.totalSupply(sdk.rest).then((res) => res.data)),
      map((sdk) => Number(sdk.supply?.find((supply) => supply.denom == 'uguu')?.amount)),
    );

    this.stakedTokens$ = sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.staking.pool(sdk.rest).then((res) => res.data)),
      map((res) => Number(res.pool?.bonded_tokens) + Number(res.pool?.not_bonded_tokens)),
    );

    this.stakedRatio$ = combineLatest([this.totalSupply$, this.stakedTokens$]).pipe(
      map(([total, staked]) => ((100 * staked!) / total!).toFixed(2)),
    );

    this.inflation$ = sdk$.pipe(
      mergeMap((sdk) => cosmosclient.rest.mint.inflation(sdk.rest).then((res) => res.data)),
      map((res) => (Number(res.inflation) * 100).toFixed(2)),
    );
  }

  ngOnInit(): void {}
}
