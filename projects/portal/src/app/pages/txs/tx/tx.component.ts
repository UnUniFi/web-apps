import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CosmosTxV1beta1GetTxResponse } from '@cosmos-client/core/esm/openapi';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-transaction',
  templateUrl: './tx.component.html',
  styleUrls: ['./tx.component.css'],
})
export class TxComponent implements OnInit {
  txHash$: Observable<string>;
  tx$: Observable<CosmosTxV1beta1GetTxResponse>;

  constructor(private route: ActivatedRoute, private cosmosRest: CosmosRestService) {
    this.txHash$ = this.route.params.pipe(map((params) => params.tx_hash));
    this.tx$ = this.txHash$.pipe(mergeMap((hash) => this.cosmosRest.getTx$(hash)));
  }

  ngOnInit() {}
}
