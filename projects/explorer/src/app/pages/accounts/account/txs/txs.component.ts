import { PaginationInfo } from '../../../txs/txs.component';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { Observable, combineLatest, of, timer } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  pollingInterval = 30;
  pageSizeOptions = [5, 10, 20, 50, 100];
  defaultPageSize = this.pageSizeOptions[0];
  defaultPageNumber = 1;

  address$: Observable<string | undefined>;
  txsTotalCount$: Observable<bigint>;
  paginationInfo$: Observable<PaginationInfo>;
  paginationInfoChanged$: Observable<PaginationInfo>;
  pageLength$: Observable<number | undefined>;
  maxPageNumber$: Observable<number>;
  txType$: Observable<string>;
  txs$: Observable<BroadcastTx200ResponseTxResponse[] | undefined>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
  ) {
    this.address$ = this.route.params.pipe(map((params) => params.address));
    const timer$ = timer(0, this.pollingInterval * 1000);
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));
    this.txType$ = this.route.queryParams.pipe(map((params) => params.txType || 'send'));
    const txEvent$ = combineLatest([this.address$, this.txType$]).pipe(
      map(([address, type]) => {
        return type === 'send'
          ? `coin_spent.spender='${address}'`
          : `coin_received.receiver='${address}'`;
      }),
    );
    const txsResponse$ = combineLatest([sdk$, txEvent$]).pipe(
      switchMap(([sdk, event]) => {
        return cosmosclient.rest.tx
          .getTxsEvent(sdk.rest, [event], undefined, undefined, undefined, true, true, 2 as any)
          .then((res) => {
            console.log(res);
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

    this.maxPageNumber$ = combineLatest([this.txsTotalCount$, this.paginationInfo$]).pipe(
      map(([txTotalCount, paginationInfo]) => {
        if (txTotalCount === undefined) {
          return 0;
        }
        const maxPageNumber = Math.ceil(Number(txTotalCount) / paginationInfo.pageSize);
        return maxPageNumber;
      }),
    );

    this.paginationInfoChanged$ = this.paginationInfo$.pipe(
      distinctUntilChanged(),
      map((paginationInfo) => paginationInfo),
    );

    this.txs$ = this.paginationInfoChanged$.pipe(
      withLatestFrom(sdk$, txEvent$),
      mergeMap(([paginationInfo, sdk, event]) => {
        return cosmosclient.rest.tx
          .getTxsEvent(
            sdk.rest,
            [event],
            undefined,
            undefined,
            paginationInfo.pageSize.toString(),
            true,
            true,
            2 as any,
            paginationInfo.pageNumber.toString(),
            paginationInfo.pageSize.toString(),
          )
          .then((res) => res.data.tx_responses)
          .catch((error) => {
            console.error(error);
            return [];
          });
      }),
    );
  }

  ngOnInit(): void {}

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

  appTxTypeChanged(txType: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        txType: txType,
      },
      queryParamsHandling: 'merge',
    });
  }
}
