import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/explorer/src/app/models/config.service';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { of, combineLatest, Observable, timer } from 'rxjs';
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
  pageSizeOptions = [5, 10, 20, 50, 100];
  txTypeOptions$?: Observable<string[] | undefined>;

  defaultPageSize = this.pageSizeOptions[1];
  defaultPageNumber = 1;
  defaultTxType = 'bank';

  selectedTxType$: Observable<string>;
  selectedTxTypeChanged$: Observable<string>;
  txsTotalCount$: Observable<bigint>;
  paginationInfo$: Observable<PaginationInfo>;
  paginationInfoChanged$: Observable<PaginationInfo>;
  pageLength$: Observable<number | undefined>;
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

    const txsResponse$ = combineLatest([sdk$, this.selectedTxTypeChanged$]).pipe(
      switchMap(([sdk, selectedTxType]) => {
        return cosmosclient.rest.tx
          .getTxsEvent(
            sdk.rest,
            [`message.module='${selectedTxType}'`],
            undefined,
            undefined,
            undefined,
            true,
          )
          .then((res) => {
            return res.data;
          })
          .catch((error) => {
            console.error(error);
            return undefined;
          });
      }),
    );

    this.txsTotalCount$ = txsResponse$.pipe(
      map((txs) => (txs?.total ? BigInt(txs.total) : BigInt(0))),
    );

    this.pageLength$ = this.txsTotalCount$.pipe(
      map((txsTotalCount) => (txsTotalCount ? parseInt(txsTotalCount.toString()) : undefined)),
    );

    this.paginationInfo$ = combineLatest([this.txsTotalCount$, this.route.queryParams]).pipe(
      switchMap(([txTotalCount, params]) => {
        //get page size from query param
        const pageSize = this.pageSizeOptions.includes(Number(params.perPage))
          ? Number(params.perPage)
          : this.defaultPageSize;

        //get page number from query param
        const pages = Number(params.pages);
        const pageNumber =
          txTotalCount === undefined || !pages || pages > Number(txTotalCount) / pageSize + 1
            ? this.defaultPageNumber
            : pages;

        return of({ pageNumber, pageSize });
      }),
    );

    this.paginationInfoChanged$ = this.paginationInfo$.pipe(
      distinctUntilChanged(),
      map((paginationInfo) => paginationInfo),
    );

    this.txs$ = combineLatest([txsResponse$, this.paginationInfoChanged$]).pipe(
      map(([txsResponse, paginationInfo]) =>
        txsResponse?.tx_responses
          ? this.getPaginatedTxs(
              txsResponse.tx_responses,
              paginationInfo.pageNumber,
              paginationInfo.pageSize,
            )
          : undefined,
      ),
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

  appPaginationChanged(pageEvent: PageEvent): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        perPage: pageEvent.pageSize,
        pages: pageEvent.pageIndex + 1,
      },
      queryParamsHandling: 'merge',
    });
  }

  getPaginatedTxs(
    txs: BroadcastTx200ResponseTxResponse[],
    pageNumber: number,
    pageSize: number,
  ): BroadcastTx200ResponseTxResponse[] {
    const max = txs.length - (pageNumber - 1) * pageSize;
    const min = max - pageSize;
    return txs.filter((_, i) => min <= i && i < max).reverse();
  }
}
