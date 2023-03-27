import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from '../../../models/ununifi/yield-aggregator.query.service';
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
  symbol$: Observable<string | null | undefined>;
  strategies$: Observable<StrategyAll200ResponseStrategiesInner[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    this.denom$ = this.route.params.pipe(map((params) => params.denom));
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbol$ = combineLatest([this.denom$, denomMetadataMap$]).pipe(
      map(([denom, denomMetadataMap]) => denomMetadataMap[denom].symbol),
    );
    this.strategies$ = this.denom$.pipe(mergeMap((denom) => this.iyaQuery.listStrategies$(denom)));
  }

  ngOnInit(): void {}
}
