import { CosmosSDKService } from '../../../models/cosmos-sdk.service';
import { txOverview } from '../../../views/txs/tx/tx.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cosmosclient, proto, rest } from '@cosmos-client/core';
import { CosmosTxV1beta1GetTxResponse } from '@cosmos-client/core/esm/openapi';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-transaction',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.css'],
})
export class TxComponent implements OnInit {
  txHash$: Observable<string>;
  tx$: Observable<CosmosTxV1beta1GetTxResponse>;
  //txO: Observable<txOverview|undefined>;
  //txOverview$: Observable<txOverview[] | undefined>;
  txOverview$: Observable<any>;

  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.txHash$ = this.route.params.pipe(map((params) => params.tx_hash));
    this.tx$ = combineLatest([this.cosmosSDK.sdk$, this.txHash$]).pipe(
      mergeMap(([sdk, hash]) => rest.tx.getTx(sdk.rest, hash).then((res) => res.data)),
    );
    this.tx$.subscribe((x) => console.log(x));
    this.txOverview$ = this.tx$.pipe(
      map((tx) => {
        //
        const B = cosmosclient.codec.unpackCosmosAny(
          tx.tx?.body?.messages?.[0],
        ) as proto.cosmos.bank.v1beta1.MsgSend;

        const C = cosmosclient.codec.unpackCosmosAny(tx.tx?.body?.messages?.[0]);

        const A = B.from_address;

        const D = tx.tx?.body?.messages?.map((Messages) =>
          cosmosclient.codec.unpackCosmosAny(Messages),
        );

        const E = D?.join();

        console.log({ A, B, C, D, E });

        return B;
      }),
    );

    //debug
    this.txOverview$.subscribe((x) => console.log(x));
  }

  ngOnInit() {}
}
