import { CosmosSDKService } from '../../../models/cosmos-sdk.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { rest } from '@cosmos-client/core';
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
  txType$: Observable<string[] | undefined>;
  constructor(private route: ActivatedRoute, private cosmosSDK: CosmosSDKService) {
    this.txHash$ = this.route.params.pipe(map((params) => params.tx_hash));
    this.tx$ = combineLatest([this.cosmosSDK.sdk$, this.txHash$]).pipe(
      mergeMap(([sdk, hash]) => rest.tx.getTx(sdk.rest, hash).then((res) => res.data)),
    );
    this.tx$.subscribe((x) => console.log(x));
    this.txType$ = this.tx$.pipe(
      map((tx) => {
        if (!tx?.tx?.body?.messages) {
          return;
        }
        return tx?.tx?.body?.messages.map((message) => {
          const txTypeRaw = (message as any)['@type'] as string;
          const startLength = txTypeRaw.lastIndexOf('.');
          const txType = txTypeRaw.substring(startLength + 1, txTypeRaw.length);
          return txType;
        });
      }),
    );

    //debug
    this.txType$.subscribe((x) => console.log('A', x));
  }

  ngOnInit() {}
}
