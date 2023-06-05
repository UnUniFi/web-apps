import { ConfigService } from '../../../models/config.service';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Router, ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  GetLatestBlock200Response,
  GetBlockByHeight200Response,
} from '@cosmos-client/core/esm/openapi';
import * as bech32 from 'bech32';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { Observable, of, zip, timer, combineLatest, BehaviorSubject } from 'rxjs';
import { filter, catchError, map, switchMap, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  pageSizeOptions = [5, 10, 20];
  pageSize$: Observable<number>;
  pageNumber$: Observable<number>;
  pageLength$: Observable<number | undefined>;
  defaultPageSize = this.pageSizeOptions[1];
  defaultPageNumber = 1;

  pollingInterval = 5;
  latestBlock$: Observable<GetLatestBlock200Response | undefined>;
  latestBlockHeight$: Observable<bigint | undefined>;
  firstBlockHeight$: Observable<bigint | undefined>;
  blocks$: Observable<GetBlockByHeight200Response[] | undefined>;

  autoEnabled: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isFirstAccess: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private readonly configS: ConfigService,
  ) {
    this.isFirstAccess = true;
    const timerWithEnable$ = combineLatest([
      timer(0, this.pollingInterval * 1000),
      this.autoEnabled.asObservable(),
    ]).pipe(
      filter(([n, enable]) => enable || this.isFirstAccess),
      map(([n, _]) => n),
    );
    const config$ = this.configS.config$;

    this.latestBlock$ = combineLatest([timerWithEnable$, this.cosmosSDK.sdk$]).pipe(
      mergeMap(([n, sdk]) =>
        cosmosclient.rest.tendermint.getLatestBlock(sdk.rest).then((res) => res.data),
      ),
    );

    this.latestBlockHeight$ = this.latestBlock$.pipe(
      map((latestBlock) => {
        this.isFirstAccess = false;
        return latestBlock?.block?.header?.height
          ? BigInt(latestBlock.block.header.height)
          : undefined;
      }),
    );

    this.pageLength$ = this.latestBlock$.pipe(
      map((latestBlock) =>
        latestBlock?.block?.header?.height ? parseInt(latestBlock.block.header.height) : undefined,
      ),
    );

    this.pageSize$ = this.route.queryParams.pipe(
      map((params) => {
        const pageSize = Number(params.perPage);
        if (this.pageSizeOptions.includes(pageSize)) {
          return pageSize;
        } else {
          return this.defaultPageSize;
        }
      }),
    );

    this.pageNumber$ = combineLatest([
      this.pageLength$,
      this.pageSize$,
      this.route.queryParams,
    ]).pipe(
      map(([pageLength, pageSize, params]) => {
        if (pageLength === undefined) {
          return this.defaultPageNumber;
        }
        const pages = Number(params.pages);
        if (!pages) return this.defaultPageNumber;
        if (pages > pageLength / pageSize + 1) return this.defaultPageNumber;
        return pages;
      }),
    );

    this.firstBlockHeight$ = combineLatest([
      this.latestBlockHeight$,
      this.pageNumber$,
      this.pageSize$,
    ]).pipe(
      switchMap(([latestBlockHeight, pageNumber, perPage]) => {
        if (latestBlockHeight === undefined) {
          return of(undefined);
        }
        const paginatedBlockHeight = latestBlockHeight - BigInt(pageNumber - 1) * BigInt(perPage);
        return of(paginatedBlockHeight);
      }),
    );

    const blocks$ = combineLatest([this.firstBlockHeight$, this.pageSize$]).pipe(
      map(([firstBlockHeight, pageSize]) => {
        if (firstBlockHeight === undefined) {
          return [];
        }
        const paginatedBlocksLength =
          pageSize < firstBlockHeight ? pageSize : Number(firstBlockHeight);
        return [...Array(paginatedBlocksLength).keys()].map(
          (index) => firstBlockHeight - BigInt(index),
        );
      }),
      mergeMap((blockHeights) =>
        zip(
          ...blockHeights.map((blockHeight) =>
            this.cosmosSDK.sdk$.pipe(
              mergeMap((sdk) =>
                cosmosclient.rest.tendermint
                  .getBlockByHeight(sdk.rest, blockHeight)
                  .then((res) => res.data),
              ),
            ),
          ),
        ),
      ),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );

    // proposer encode
    this.blocks$ = combineLatest([blocks$, config$]).pipe(
      map(([blocks, config]) => {
        return blocks?.map((block) => {
          if (block?.block?.header?.proposer_address) {
            const byteArray = Uint8Array.from(
              Buffer.from(block.block.header.proposer_address, 'base64'),
            );
            block.block.header.proposer_address = bech32.encode(
              config?.bech32Prefix?.consPub || 'ununifivalconspub',
              bech32.toWords(byteArray),
            );
          }
          return block;
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

  onCheckBoxAutoChange(checked: boolean) {
    this.autoEnabled.next(checked);
  }
}
