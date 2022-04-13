import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest, proto } from '@cosmos-client/core';
import { InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class BlockComponent implements OnInit {
  blockHeight$: Observable<string>;
  block$: Observable<InlineResponse20036>;
  nextBlock$: Observable<number>;
  previousBlock$: Observable<number>;
  latestBlockHeight$: Observable<string>;
  txs$: Observable<any>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.blockHeight$ = this.route.params.pipe(map((params) => params.block_height));
    this.block$ = combineLatest([this.cosmosSDK.sdk$, this.blockHeight$]).pipe(
      mergeMap(([sdk, height]) =>
        rest.tendermint.getBlockByHeight(sdk.rest, BigInt(height)).then((res) => res.data),
      ),
    );

    // Todo: get txs from hash in block (decode base64 and read by protocol buf)
    this.txs$ = combineLatest([this.cosmosSDK.sdk$, this.blockHeight$, this.block$]).pipe(
      filter(([sdk, height, block]) => (block.block?.data?.txs?.length || 0) > 0),
      map(([sdk, height, block]) => {
        console.log('tx,block,start');
        const encodeString = block?.block?.data?.txs?.[0];
        const decode = window.atob(encodeString || '');

        const num = block?.block?.header?.data_hash;
        const height2 = block?.block?.header?.height;

        //[`message.module='${selectedTxType}'`],
        const key = `tx.height='${height2}'`;
        //const key = `message.module='bank'`;

        console.log('decode', decode);
        console.log('tx,num', height, height2, key);

        return rest.tx
          .getTxsEvent(sdk.rest, [`tx.height='${height}'`])
          .then((res) => res.data.tx_responses)
          .catch((error) => {
            console.error(error);
            return BigInt(0);
          });
      }),
    );
    this.txs$.subscribe((x) => console.log(x));

    this.latestBlockHeight$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) => rest.tendermint.getLatestBlock(sdk.rest).then((res) => res.data)),
      map((block) => block.block?.header?.height || ''),
    );

    this.nextBlock$ = combineLatest([this.latestBlockHeight$, this.blockHeight$]).pipe(
      map(([latestBlockHeight, height]) => {
        if (latestBlockHeight == '') {
          return Number(height);
        }
        if (Number(height) + 1 > Number(latestBlockHeight)) {
          return Number(height);
        }
        return Number(height) + 1;
      }),
    );

    this.previousBlock$ = this.blockHeight$.pipe(
      map((height) => (0 > Number(height) ? Number(height) : Number(height) - 1)),
    );
  }

  ngOnInit(): void {}
}
