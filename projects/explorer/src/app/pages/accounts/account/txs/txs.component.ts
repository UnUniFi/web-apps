import { CosmosSDKService } from '../../../../models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi';
import { of, combineLatest, Observable } from 'rxjs';
import { map, mergeMap, switchMap, distinctUntilChanged, withLatestFrom } from 'rxjs/operators';
import { txParseMsg, } from "./../../../../utils/tx-parser"
import { txTitle } from '../../../../models/cosmos/tx-common.model';

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
  pageSizeOptions = [5, 10, 20, 50, 100];
  defaultPageSize = this.pageSizeOptions[1];
  defaultPageNumber = 1;

  address$: Observable<string | undefined>;
  txs$: Observable<CosmosTxV1beta1GetTxsEventResponse | undefined>;
  txsTotalCount$: Observable<bigint>;
  paginationInfoChanged$: Observable<PaginationInfo>;

  paginationInfo$: Observable<PaginationInfo>;
  pageLength$: Observable<number | undefined>;
  txsWithPagination$: Observable<CosmosTxV1beta1GetTxsEventResponse | undefined>;
  txTitles$: Observable<txTitle[] | undefined>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
  ) {
    this.address$ = this.route.params.pipe(map((params) => params.address));
    const sdk$ = this.cosmosSDK.sdk$;

    this.txs$ = combineLatest([sdk$, this.address$]).pipe(
      mergeMap(([sdk, address]) => {
        return rest.tx
          .getTxsEvent(
            sdk.rest,
            [`message.sender='${address}'`],
            undefined,
            undefined,
            undefined,
            true,
          )
          .then((res) => res.data)
          .catch((error) => {
            console.error(error);
            return undefined;
          });
      }),
    );

    this.txsTotalCount$ = combineLatest([sdk$, this.address$]).pipe(
      mergeMap(([sdk, address]) => {
        return rest.tx
          .getTxsEvent(
            sdk.rest,
            [`message.sender='${address}'`],
            undefined,
            undefined,
            undefined,
            true,
          )
          .then((res) =>
            res.data.pagination?.total ? BigInt(res.data.pagination?.total) : BigInt(0),
          )
          .catch((error) => {
            console.error(error);
            return BigInt(0);
          });
      }),
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

    this.txsWithPagination$ = this.paginationInfoChanged$.pipe(
      withLatestFrom(sdk$, this.address$, this.txsTotalCount$),
      mergeMap(([paginationInfo, sdk, address, txsTotalCount]) => {
        const pageOffset = BigInt(paginationInfo.pageSize) * BigInt(paginationInfo.pageNumber - 1);

        const modifiedPageSize =
          txsTotalCount <= pageOffset
            ? txsTotalCount % BigInt(paginationInfo.pageSize)
            : BigInt(paginationInfo.pageSize);

        if (pageOffset < 0 || modifiedPageSize <= 0) {
          return [];
        }

        return rest.tx
          .getTxsEvent(
            sdk.rest,
            [`message.sender='${address}'`],
            undefined,
            pageOffset,
            modifiedPageSize,
            true,
          )
          .then((res) => res.data)
          .catch((error) => {
            console.error(error);
            return undefined;
          });
      }),
    );

    this.txTitles$ = this.txsWithPagination$.pipe(
      map((txs) => {
        if (!txs?.txs) {
          return undefined;
        }
        const txTypeList = txs?.txs?.map((tx) => txParseMsg(tx.body?.messages?.[0]!));
        return txTypeList;
      }),
    );
  }

  ngOnInit(): void { }

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
