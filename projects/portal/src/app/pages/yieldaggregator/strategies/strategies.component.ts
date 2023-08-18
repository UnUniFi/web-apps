import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from '../../../models/yield-aggregators/yield-aggregator.query.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cosmos } from '@cosmos-client/core/esm/proto';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css'],
})
export class StrategiesComponent implements OnInit {
  denom$: Observable<string>;
  ibcDenom$: Observable<string>;
  symbol$: Observable<string>;
  displaySymbol$: Observable<string>;
  availableSymbols$: Observable<{ symbol: string; display: string }[]>;
  symbolMetadataMap$: Observable<{ [symbol: string]: cosmos.bank.v1beta1.IMetadata }>;
  symbolImage$: Observable<string | null>;
  strategies$: Observable<StrategyAll200ResponseStrategiesInner[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    this.denom$ = this.route.params.pipe(map((params) => params.denom));
    this.ibcDenom$ = this.route.params.pipe(
      map((params) => (params.ibc_denom ? 'ibc/' + params.ibc_denom : '')),
    );
    this.symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbol$ = combineLatest([this.denom$, this.ibcDenom$, denomMetadataMap$]).pipe(
      map(([denom, ibcDenom, denomMetadataMap]) =>
        ibcDenom == ''
          ? denomMetadataMap[denom]?.symbol || ''
          : denomMetadataMap[ibcDenom]?.symbol || '',
      ),
    );
    this.displaySymbol$ = combineLatest([this.denom$, this.ibcDenom$, denomMetadataMap$]).pipe(
      map(([denom, ibcDenom, denomMetadataMap]) =>
        ibcDenom == ''
          ? denomMetadataMap[denom]?.display || denom
          : denomMetadataMap[ibcDenom]?.display || denom,
      ),
    );
    this.symbolImage$ = this.symbol$.pipe(
      map((symbol) => (symbol ? this.bankQuery.getSymbolImageMap()[symbol] : null)),
    );
    const allStrategies$ = this.iyaQuery.listStrategies$();
    this.availableSymbols$ = combineLatest([allStrategies$, denomMetadataMap$]).pipe(
      map(([allStrategies, denomMetadataMap]) => {
        const symbols = allStrategies
          .map((strategy) => {
            const denomMetadata = denomMetadataMap[strategy.strategy?.denom || ''];
            if (denomMetadata) {
              return {
                symbol: denomMetadata.symbol || '',
                display: denomMetadata.display || strategy.strategy?.denom || '',
              };
            } else {
              return undefined;
            }
          })
          .filter((symbol): symbol is { symbol: string; display: string } => !!symbol);
        return [...new Set(symbols)];
      }),
    );
    this.strategies$ = combineLatest([allStrategies$, this.denom$, this.ibcDenom$]).pipe(
      map(([strategies, denom, ibcDenom]) => {
        if (ibcDenom == '') {
          if (denom) {
            return strategies.filter((strategy) => strategy.strategy?.denom == denom);
          } else {
            return strategies;
          }
        } else {
          return strategies.filter((strategy) => strategy.strategy?.denom == ibcDenom);
        }
      }),
    );
  }

  ngOnInit(): void {}

  onChangeDenom(denom: string): void {
    this.router.navigate(['/yield-aggregator/strategies/' + denom]);
  }
}
