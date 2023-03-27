import { BankQueryService } from '../../models/cosmos/bank.query.service';
import { Component, OnInit } from '@angular/core';
import { cosmos } from '@cosmos-client/core/esm/proto';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-yield-aggregator',
  templateUrl: './yield-aggregator.component.html',
  styleUrls: ['./yield-aggregator.component.css'],
})
export class YieldAggregatorComponent implements OnInit {
  symbolMetadataMap$: Observable<{ [symbol: string]: cosmos.bank.v1beta1.IMetadata }>;

  constructor(private readonly bankQuery: BankQueryService) {
    this.symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
  }

  ngOnInit(): void {}
}
