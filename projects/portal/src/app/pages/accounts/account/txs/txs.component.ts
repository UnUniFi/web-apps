import { CosmosRestService } from '../../../../models/cosmos-rest.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CosmosTxV1beta1GetTxsEventResponse } from '@cosmos-client/core/esm/openapi';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-txs',
  templateUrl: './txs.component.html',
  styleUrls: ['./txs.component.css'],
})
export class TxsComponent implements OnInit {
  address$: Observable<string | undefined>;
  txsWithPagination$: Observable<CosmosTxV1beta1GetTxsEventResponse | undefined>;

  constructor(private route: ActivatedRoute, private cosmosRest: CosmosRestService) {
    this.address$ = this.route.params.pipe(map((params) => params.address));
    this.txsWithPagination$ = this.address$.pipe(
      mergeMap((address) => {
        if (address === undefined) {
          return of(undefined);
        }
        return this.cosmosRest.getAccountTxsEvent$(address);
      }),
    );
  }

  ngOnInit(): void {}
}
