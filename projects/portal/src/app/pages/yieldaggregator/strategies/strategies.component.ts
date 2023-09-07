import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from '../../../models/yield-aggregators/yield-aggregator.query.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
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
  denomMetadataMap$: Observable<{
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;
  symbolImageMap: { [symbol: string]: string };
  availableDenoms$: Observable<string[]>;
  strategies$: Observable<StrategyAll200ResponseStrategiesInner[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    this.denom$ = this.route.params.pipe(map((params) => params.denom));
    this.denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbolImageMap = this.bankQuery.getSymbolImageMap();
    const allStrategies$ = this.iyaQuery.listStrategies$();
    this.availableDenoms$ = allStrategies$.pipe(
      map((allStrategies) => {
        const denoms = allStrategies
          .map((strategy) => strategy.strategy?.denom)
          .filter((denom): denom is string => !!denom);
        return [...new Set(denoms)];
      }),
    );
    this.strategies$ = combineLatest([allStrategies$, this.denom$]).pipe(
      map(([strategies, denom]) => {
        if (denom) {
          return strategies.filter((strategy) => strategy.strategy?.denom == denom);
        } else {
          return strategies;
        }
      }),
    );
  }

  ngOnInit(): void {}

  onChangeDenom(denom: string): void {
    this.router.navigate(['/yield-aggregator/strategies/', denom]);
  }
}
