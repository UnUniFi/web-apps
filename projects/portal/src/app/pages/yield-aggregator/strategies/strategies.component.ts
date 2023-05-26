import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from '../../../models/yield-aggregators/yield-aggregator.query.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css'],
})
export class StrategiesComponent implements OnInit {
  denom$: Observable<string>;
  ibcDenom$: Observable<string>;
  symbol$: Observable<string | null | undefined>;
  symbolImage$: Observable<string | null>;
  strategies$: Observable<StrategyAll200ResponseStrategiesInner[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    this.denom$ = this.route.params.pipe(map((params) => params.denom));
    this.ibcDenom$ = this.route.params.pipe(
      map((params) => (params.ibc_denom ? 'ibc/' + params.ibc_denom : '')),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbol$ = combineLatest([this.denom$, this.ibcDenom$, denomMetadataMap$]).pipe(
      map(([denom, ibcDenom, denomMetadataMap]) =>
        ibcDenom == '' ? denomMetadataMap[denom].symbol : denomMetadataMap[ibcDenom].symbol,
      ),
    );
    this.symbolImage$ = this.symbol$.pipe(
      map((symbol) => (symbol ? this.bankQuery.getSymbolImageMap()[symbol] : null)),
    );
    this.strategies$ = combineLatest([this.denom$, this.ibcDenom$]).pipe(
      mergeMap(([denom, ibcDenom]) =>
        ibcDenom == ''
          ? this.iyaQuery.listStrategies$(denom)
          : this.iyaQuery.listStrategies$(ibcDenom),
      ),
    );
  }

  ngOnInit(): void {}
}
