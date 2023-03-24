import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.query.service';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css'],
})
export class StrategyComponent implements OnInit {
  strategy$: Observable<StrategyAll200ResponseStrategiesInner>;

  constructor(
    private route: ActivatedRoute,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    const params$ = this.route.params;
    this.strategy$ = params$.pipe(
      mergeMap((params) => this.iyaQuery.getStrategy$(params.denom, params.strategy_id)),
    );
  }

  ngOnInit(): void {}
}
