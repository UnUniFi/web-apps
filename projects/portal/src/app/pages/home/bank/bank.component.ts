import { CosmosRestService } from '../../../models/cosmos-rest.service';
import { Component, OnInit } from '@angular/core';
import { QueryTotalSupplyResponseIsTheResponseTypeForTheQueryTotalSupplyRPCMethod } from '@cosmos-client/core/esm/openapi/api';
import { Observable, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styleUrls: ['./bank.component.css'],
})
export class BankComponent implements OnInit {
  totalSupply$: Observable<QueryTotalSupplyResponseIsTheResponseTypeForTheQueryTotalSupplyRPCMethod>;

  constructor(private readonly cosmosRest: CosmosRestService) {
    const timer$ = timer(0, 60 * 60 * 1000);
    this.totalSupply$ = timer$.pipe(mergeMap(() => this.cosmosRest.getTotalSupply$()));
  }

  ngOnInit(): void {}
}
