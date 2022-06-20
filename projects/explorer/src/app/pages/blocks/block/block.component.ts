import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { AccAddress } from '@cosmos-client/core/cjs/types';
import { InlineResponse20036 } from '@cosmos-client/core/esm/openapi';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi/api';
import { CosmosSDKService } from 'projects/explorer/src/app/models/cosmos-sdk.service';
import { combineLatest, Observable } from 'rxjs';
import { map, filter, mergeMap } from 'rxjs/operators';
import { cosmos } from 'ununifi-client';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.css'],
})
export class BlockComponent implements OnInit {
  blockHeight$: Observable<string>;
  block$: Observable<InlineResponse20036>;
  blockHash$: Observable<string>;
  proposer$: Observable<string>;
  nextBlock$: Observable<number>;
  previousBlock$: Observable<number>;
  latestBlockHeight$: Observable<string>;
  txs$: Observable<CosmosTxV1beta1GetTxsEventResponse | undefined>;
  txTypes$: Observable<string[] | undefined>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.blockHeight$ = this.route.params.pipe(map((params) => params.block_height));
    this.block$ = combineLatest([this.cosmosSDK.sdk$, this.blockHeight$]).pipe(
      mergeMap(([sdk, height]) =>
        rest.tendermint.getBlockByHeight(sdk.rest, BigInt(height)).then((res) => res.data),
      ),
    );
    this.blockHash$ = this.block$.pipe(
      map((block) => {
        const base64Decoded = Uint8Array.from(Buffer.from(block.block_id?.hash!, 'base64'));
        return Buffer.from(base64Decoded).toString('hex');
      }),
    );
    this.proposer$ = this.block$.pipe(
      map((block) => {
        console.log(block.block?.header?.proposer_address!);
        const base64Decoded = Uint8Array.from(
          Buffer.from(block.block?.header?.proposer_address!, 'base64'),
        );
        const proposer = new cosmosclient.ValAddress(base64Decoded);
        return proposer.toString();
      }),
    );

    this.txs$ = combineLatest([this.cosmosSDK.sdk$, this.blockHeight$, this.block$]).pipe(
      filter(([sdk, height, block]) => (block.block?.data?.txs?.length || 0) > 0),
      mergeMap(([sdk, height, block]) =>
        rest.tx
          .getTxsEvent(sdk.rest, [`tx.height=${height}`], undefined, undefined, undefined, true)
          .then((res) => {
            console.log('res', res);
            return res.data;
          })
          .catch((error) => {
            console.error(error);
            return undefined;
          }),
      ),
    );
    this.txTypes$ = this.txs$.pipe(
      map((txs) => {
        if (!txs?.txs) {
          return undefined;
        }
        const txTypeList = txs?.txs?.map((tx) => {
          if (!tx.body?.messages) {
            return '';
          }
          const txTypes = tx.body?.messages.map((message) => {
            if (!message) {
              return [];
            }
            const txTypeRaw = (message as any)['@type'] as string;
            const startLength = txTypeRaw.lastIndexOf('.');
            const txType = txTypeRaw.substring(startLength + 1, txTypeRaw.length);
            return txType;
          });
          return txTypes.join();
        });
        return txTypeList;
      }),
    );

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
