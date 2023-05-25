import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  GetBlockByHeight200Response,
  GetLatestBlock200Response,
} from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { Observable, of, zip, timer } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css'],
})
export class BlocksComponent implements OnInit {
  pollingInterval = 30 * 60;
  latestBlock$: Observable<GetLatestBlock200Response | undefined>;
  latestBlockHeight$: Observable<bigint | undefined>;
  //latestBlocks$: Observable<GetBlockByHeight200Response[] | undefined>;
  latestBlocks$: Observable<bigint[] | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    const timer$ = timer(0, this.pollingInterval * 1000);
    // eslint-disable-next-line no-unused-vars
    const sdk$ = timer$.pipe(mergeMap((_) => this.cosmosSDK.sdk$));
    this.latestBlock$ = sdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.tendermint.getLatestBlock(sdk.rest).then((res) => res.data),
      ),
    );
    this.latestBlockHeight$ = this.latestBlock$.pipe(
      // eslint-disable-next-line no-undef
      map((latestBlock) =>
        latestBlock?.block?.header?.height ? BigInt(latestBlock.block.header.height) : undefined,
      ),
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
    this.latestBlocks$ = this.latestBlockHeight$.pipe(
      map((latestBlockHeight) =>
        [...Array(20).keys()].map((index) => {
          if (latestBlockHeight === undefined) {
            throw Error('latestBlockHeight should not be undfined!');
          }
          // eslint-disable-next-line no-undef
          return latestBlockHeight - BigInt(index);
        }),
      ),
      /*
      mergeMap((blockHeights) =>
        zip(
          ...blockHeights.map((blockHeight) =>
            this.cosmosSDK.sdk$.pipe(
              mergeMap((sdk) =>
                cosmosclient.rest.tendermint.getBlockByHeight(sdk.rest, blockHeight).then((res) => res.data),
              ),
            ),
          ),
        ),
      ),
      */
      catchError((error) => {
        console.error(error);
        return of(undefined);
      }),
    );
  }

  ngOnInit(): void {}
}
