import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.query.service';
import { YieldAggregatorService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.service';
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
  ibcDenom$: Observable<string>;
  symbol$: Observable<string>;
  displaySymbol$: Observable<string>;
  symbolImage$: Observable<string | null>;
  strategy$: Observable<StrategyAll200ResponseStrategiesInner | undefined>;
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;
  weights$: Observable<(string | undefined)[]>;
  strategyAPR$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly iyaService: YieldAggregatorService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly configService: ConfigService,
  ) {
    const params$ = this.route.params;
    this.id$ = params$.pipe(map((params) => params.strategy_id));
    this.denom$ = params$.pipe(map((params) => params.denom));
    this.ibcDenom$ = this.route.params.pipe(
      map((params) => (params.ibc_denom ? 'ibc/' + params.ibc_denom : '')),
    );
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
          : denomMetadataMap[ibcDenom]?.display || ibcDenom,
      ),
    );
    this.symbolImage$ = this.symbol$.pipe(
      map((symbol) => (symbol ? this.bankQuery.getSymbolImageMap()[symbol] : null)),
    );
    const strategies$ = combineLatest([this.denom$, this.ibcDenom$]).pipe(
      mergeMap(([denom, ibcDenom]) =>
        ibcDenom == ''
          ? this.iyaQuery.listStrategies$(denom)
          : this.iyaQuery.listStrategies$(ibcDenom),
      ),
    );
    this.strategy$ = combineLatest([this.id$, strategies$]).pipe(
      map(([id, strategies]) => strategies.find((s) => s.strategy?.id == id)),
    );
    const allVaults$ = this.iyaQuery.listVaults$();
    this.vaults$ = combineLatest([allVaults$, this.id$]).pipe(
      map(([vaults, id]) =>
        vaults.filter((vault) =>
          vault.vault?.strategy_weights?.find((strategy) => strategy.strategy_id === id),
        ),
      ),
    );
    this.weights$ = combineLatest([this.vaults$, this.id$]).pipe(
      map(([vaults, id]) =>
        vaults.map(
          (vault) =>
            vault.vault?.strategy_weights?.find((strategy) => strategy.strategy_id === id)?.weight,
        ),
      ),
    );
    this.strategyAPR$ = combineLatest([this.strategy$, this.configService.config$]).pipe(
      mergeMap(async ([strategy, config]) => {
        const info = config?.strategiesInfo?.find((s) => s.id == strategy?.strategy?.id);
        const apr = await this.iyaService.getStrategyAPR(info);
        return apr;
      }),
    );
  }

  ngOnInit(): void {}
}
