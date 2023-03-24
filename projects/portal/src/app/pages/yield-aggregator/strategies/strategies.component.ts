import { YieldAggregatorQueryService } from '../../../models/ununifi/yield-aggregator.query.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css'],
})
export class StrategiesComponent implements OnInit {
  denom$: Observable<string>;
  strategies$: Observable<StrategyAll200ResponseStrategiesInner[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    this.denom$ = this.route.params.pipe(map((params) => params.denom));
    this.strategies$ = this.denom$.pipe(mergeMap((denom) => this.iyaQuery.listStrategies$(denom)));
  }

  ngOnInit(): void {}
}
