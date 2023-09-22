import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BroadcastTx200ResponseTxResponse } from '@cosmos-client/core/esm/openapi';
import { CosmosRestService } from 'projects/portal/src/app/models/cosmos-rest.service';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  address$: Observable<string | undefined>;
  txs$: Observable<BroadcastTx200ResponseTxResponse[] | undefined>;

  constructor(private route: ActivatedRoute, private cosmosRest: CosmosRestService) {
    this.address$ = this.route.params.pipe(map((params) => params.address));
    this.txs$ = this.address$.pipe(
      mergeMap((address) => {
        if (address === undefined) {
          return of(undefined);
        }
        return this.cosmosRest
          .getAccountTxsEvent$(address)
          .pipe(map((txs) => txs?.tx_responses?.reverse()));
      }),
    );
  }

  ngOnInit(): void {}
}
