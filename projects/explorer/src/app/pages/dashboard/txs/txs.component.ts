import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/explorer/src/app/models/config.service';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable, timer } from 'rxjs';
import { map, mergeMap, switchMap, distinctUntilChanged, withLatestFrom } from 'rxjs/operators';

export type PaginationInfo = {
  pageSize: number;
  pageNumber: number;
};

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  pollingInterval = 30;

  txTypeOptions$?: Observable<string[] | undefined>;
  defaultTxType = 'bank';

  selectedTxType$: Observable<string>;
  selectedTxTypeChanged$: Observable<string>;
  txs$?: Observable<BroadcastTx200ResponseTxResponse[] | undefined>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private configService: ConfigService,
  ) {
    this.txTypeOptions$ = this.configService.config$.pipe(
      map((config) => config?.extension?.messageModules),
    );
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));

    this.selectedTxType$ = combineLatest([this.txTypeOptions$, this.route.queryParams]).pipe(
      map(([options, params]) =>
        options?.includes(params.txType) ? params.txType : this.defaultTxType,
      ),
    );

    this.selectedTxTypeChanged$ = this.selectedTxType$.pipe(
      distinctUntilChanged(),
      map((txType) => txType),
    );

    this.txs$ = combineLatest([sdk$, this.selectedTxTypeChanged$]).pipe(
      switchMap(([sdk, selectedTxType]) => {
        return cosmosclient.rest.tx
          .getTxsEvent(
            sdk.rest,
            [`message.module='${selectedTxType}'`],
            undefined,
            undefined,
            undefined,
            false,
            true,
          )
          .then((res) => res.data.tx_responses)
          .catch((error) => {
            console.error(error);
            return [];
          });
      }),
      map((latestTxs) => latestTxs?.reverse().slice(0, 5)),
    );
  }

  ngOnInit(): void {}

  appSelectedTxTypeChanged(selectedTxType: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        txType: selectedTxType,
      },
      queryParamsHandling: 'merge',
    });
  }
}
