import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.query.service';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  StrategyAll200ResponseStrategiesInner,
  VaultAll200ResponseVaultsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-strategy',
  templateUrl: './strategy.component.html',
  styleUrls: ['./strategy.component.css'],
})
export class StrategyComponent implements OnInit {
  id$: Observable<string>;
  denom$: Observable<string>;
  symbol$: Observable<string | null | undefined>;
  strategy$: Observable<StrategyAll200ResponseStrategiesInner>;
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;
  weights$: Observable<(string | undefined)[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    const params$ = this.route.params;
    this.id$ = params$.pipe(map((params) => params.strategy_id));
    this.denom$ = params$.pipe(map((params) => params.denom));
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbol$ = combineLatest([this.denom$, denomMetadataMap$]).pipe(
      map(([denom, denomMetadataMap]) => denomMetadataMap[denom].symbol),
    );
    this.strategy$ = params$.pipe(
      mergeMap((params) => this.iyaQuery.getStrategy$(params.denom, params.strategy_id)),
    );
    const allVaults$ = this.iyaQuery.listVaults$();
    this.vaults$ = combineLatest([allVaults$, this.id$]).pipe(
      map(([vaults, id]) =>
        vaults.filter((vault) =>
          vault.strategy_weights?.find((strategy) => strategy.strategy_id === id),
        ),
      ),
    );
    this.weights$ = combineLatest([this.vaults$, this.id$]).pipe(
      map(([vaults, id]) =>
        vaults.map(
          (vault) =>
            vault.strategy_weights?.find((strategy) => strategy.strategy_id === id)?.weight,
        ),
      ),
    );
  }

  ngOnInit(): void {}
}
