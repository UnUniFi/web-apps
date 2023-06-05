import { ConfigService } from '../../../models/config.service';
import { Config } from '../../../models/config.service';
import { txTitle } from '../../../models/cosmos/tx-common.model';
import { txParseMsg } from './../../../utils/tx-parser';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { GetBlockByHeight200Response } from '@cosmos-client/core/esm/openapi';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi/api';
import * as bech32 from 'bech32';
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
  block$: Observable<GetBlockByHeight200Response>;
  nextBlock$: Observable<number>;
  previousBlock$: Observable<number>;
  latestBlockHeight$: Observable<string>;
  txs$: Observable<CosmosTxV1beta1GetTxsEventResponse | undefined>;
  txTitles$: Observable<txTitle[] | undefined>;

  constructor(
    private route: ActivatedRoute,
    private cosmosSDK: CosmosSDKService,
    private readonly configS: ConfigService,
  ) {
    this.blockHeight$ = this.route.params.pipe(map((params) => params.block_height));
    const config$ = this.configS.config$;
    const block$ = combineLatest([this.cosmosSDK.sdk$, this.blockHeight$]).pipe(
      mergeMap(([sdk, height]) =>
        cosmosclient.rest.tendermint
          .getBlockByHeight(sdk.rest, BigInt(height))
          .then((res) => res.data),
      ),
    );
    // hash & proposer encode
    this.block$ = combineLatest([block$, config$]).pipe(
      map(([block, config]) => {
        if (block.block?.header?.proposer_address) {
          const byteArray = Uint8Array.from(
            Buffer.from(block.block.header.proposer_address, 'base64'),
          );
          block.block.header.proposer_address = bech32.encode(
            config?.bech32Prefix?.consPub || 'ununifivalconspub',
            bech32.toWords(byteArray),
          );
        }
        return block;
      }),
      map((block) => {
        if (block.block_id?.hash) {
          const byteArray = Uint8Array.from(Buffer.from(block.block_id.hash, 'base64'));
          block.block_id.hash = Buffer.from(byteArray).toString('hex').toUpperCase();
        }
        return block;
      }),
    );

    this.txs$ = combineLatest([this.cosmosSDK.sdk$, this.blockHeight$, this.block$]).pipe(
      filter(([sdk, height, block]) => (block.block?.data?.txs?.length || 0) > 0),
      mergeMap(([sdk, height, block]) =>
        cosmosclient.rest.tx
          .getTxsEvent(sdk.rest, [`tx.height=${height}`], undefined, undefined, undefined, true)
          .then((res) => res.data)
          .catch((error) => {
            console.error(error);
            return undefined;
          }),
      ),
    );
    this.txTitles$ = this.txs$.pipe(
      map((txs) => {
        if (!txs?.txs) {
          return undefined;
        }
        const txTypeList = txs?.txs?.map((tx) => txParseMsg(tx.body?.messages?.[0]!));
        return txTypeList;
      }),
    );

    this.latestBlockHeight$ = this.cosmosSDK.sdk$.pipe(
      mergeMap((sdk) =>
        cosmosclient.rest.tendermint.getLatestBlock(sdk.rest).then((res) => res.data),
      ),
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
