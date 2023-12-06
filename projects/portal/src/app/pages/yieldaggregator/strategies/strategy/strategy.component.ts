import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService, StrategyInfo } from 'projects/portal/src/app/models/config.service';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { OsmosisPoolAPRs } from 'projects/portal/src/app/models/yield-aggregators/osmosis/osmosis-pool.model';
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
  denomMetadataMap$: Observable<{
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;
  symbolImageMap: { [symbol: string]: string };
  strategy$: Observable<StrategyAll200ResponseStrategiesInner | undefined>;
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;
  weights$: Observable<(string | undefined)[]>;
  strategyInfo$: Observable<StrategyInfo | undefined>;
  strategyAPR$: Observable<OsmosisPoolAPRs>;

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
    this.symbolImageMap = this.bankQuery.getSymbolImageMap();
    this.denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    const strategies$ = this.denom$.pipe(mergeMap((denom) => this.iyaQuery.listStrategies$(denom)));
    this.strategy$ = combineLatest([this.id$, strategies$]).pipe(
      map(([id, strategies]) => strategies.find((s) => s.strategy?.id == id)),
    );
    const allVaults$ = this.iyaQuery.listVaults$();
    this.vaults$ = combineLatest([allVaults$, this.id$, this.denom$]).pipe(
      map(([vaults, id, denom]) =>
        vaults.filter((vault) =>
          vault.vault?.strategy_weights?.find(
            (strategy) => strategy.denom === denom && strategy.strategy_id === id,
          ),
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
    this.strategyInfo$ = combineLatest([this.strategy$, this.configService.config$]).pipe(
      map(([strategy, config]) =>
        config?.strategiesInfo?.find(
          (s) => s.denom == strategy?.strategy?.denom && s.id == strategy?.strategy?.id,
        ),
      ),
    );
    this.strategyAPR$ = this.strategyInfo$.pipe(
      mergeMap(async (strategyInfo) => await this.iyaService.getStrategyAPR(strategyInfo)),
    );
  }

  ngOnInit(): void {}
}
