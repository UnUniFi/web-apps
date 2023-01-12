import { CosmosRestService } from '../../models/cosmos-rest.service';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/esm/openapi/api';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { combineLatest, Observable, of, timer } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

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
    private configService: ConfigService,
    private cosmosRest: CosmosRestService,
  ) {
    this.txTypeOptions$ = this.configService.config$.pipe(
      map((config) => config?.extension?.messageModules),
    );
    const timer$ = timer(0, this.pollingInterval * 1000);

    this.selectedTxType$ = combineLatest([this.txTypeOptions$, this.route.queryParams]).pipe(
      map(([options, params]) =>
        options?.includes(params.txType) ? params.txType : this.defaultTxType,
      ),
    );

    this.selectedTxTypeChanged$ = this.selectedTxType$.pipe(
      distinctUntilChanged(),
      map((txType) => txType),
    );

    this.txsTotalCount$ = timer$.pipe(
      withLatestFrom(this.selectedTxType$),
      switchMap(([_, selectedTxType]) => this.cosmosRest.getSelectedTxTypeEvent$(selectedTxType)),
      map((res) => res.pagination?.total),
      map((total) => (total ? BigInt(total) : BigInt(0))),
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

    this.txs$ = this.paginationInfoChanged$.pipe(
      withLatestFrom(timer$, this.selectedTxType$, this.txsTotalCount$),
      mergeMap(([paginationInfo, _, selectedTxType, txsTotalCount]) => {
        const pageOffset =
          txsTotalCount - BigInt(paginationInfo.pageSize) * BigInt(paginationInfo.pageNumber);
        const modifiedPageOffset = pageOffset < 1 ? BigInt(1) : pageOffset;
        const modifiedPageSize =
          pageOffset < 1
            ? pageOffset + BigInt(paginationInfo.pageSize)
            : BigInt(paginationInfo.pageSize);
        // Note: This is strange. This is temporary workaround way.
        const temporaryWorkaroundPageSize =
          txsTotalCount === BigInt(1) &&
          modifiedPageOffset === BigInt(1) &&
          modifiedPageSize === BigInt(1)
            ? modifiedPageSize + BigInt(1)
            : modifiedPageSize;

        if (modifiedPageOffset <= 0 || modifiedPageSize <= 0) {
          return [];
        }

        return this.cosmosRest.getSelectedTxTypeEvent$(
          selectedTxType,
          modifiedPageOffset,
          temporaryWorkaroundPageSize,
        );
      }),
      map((res) => res.tx_responses),
      map((latestTxs) => latestTxs?.reverse()),
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
}
