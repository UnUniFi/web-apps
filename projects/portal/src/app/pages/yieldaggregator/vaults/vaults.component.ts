import {
  BandProtocolService,
  TokenAmountUSD,
} from '../../../models/band-protocols/band-protocol.service';
import { ConfigService } from '../../../models/config.service';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from '../../../models/yield-aggregators/yield-aggregator.query.service';
import { YieldAggregatorService } from '../../../models/yield-aggregators/yield-aggregator.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
})
export class VaultsComponent implements OnInit {
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;
  symbols$: Observable<{ name: string; img: string }[]>;
  apy$: Observable<number[]>;
  totalDeposited$: Observable<TokenAmountUSD[]>;
  keyword$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaService: YieldAggregatorService,
    private readonly configService: ConfigService,
    private readonly bandProtocolService: BandProtocolService,
  ) {
    this.keyword$ = this.route.queryParams.pipe(map((params) => params.keyword));
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.vaults$ = combineLatest([
      this.iyaQuery.listVaults$(),
      this.route.queryParams,
      denomMetadataMap$,
    ]).pipe(
      map(([vaults, params, denomMetadata]) =>
        params.keyword
          ? vaults.filter((vault) => {
              const hasIdMatch = vault.id && vault.id.includes(params.keyword);
              const hasOwnerMatch = vault.owner?.includes(params.keyword);
              const hasDenomMatch = vault.denom?.includes(params.keyword);
              const hasSymbolMatch = vault.denom
                ? denomMetadata?.[vault.denom].symbol?.includes(params.keyword)
                : false;
              return hasIdMatch || hasOwnerMatch || hasDenomMatch || hasSymbolMatch;
            })
          : vaults,
      ),
    );
    this.symbols$ = combineLatest([this.vaults$, denomMetadataMap$]).pipe(
      map(([vaults, denomMetadataMap]) =>
        vaults.map((vault) => {
          const symbol = denomMetadataMap?.[vault.denom!].symbol || 'Invalid Asset';
          const img = this.bankQuery.getSymbolImageMap()[symbol];
          return { name: symbol, img: img };
        }),
      ),
    );
    const symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    this.totalDeposited$ = combineLatest([this.symbols$, this.vaults$, symbolMetadataMap$]).pipe(
      mergeMap(([symbols, vaults, symbolMetadataMap]) =>
        Promise.all(
          symbols.map(async (symbol, index) => {
            const vault = await this.iyaQuery
              .getVault$(vaults[index].id!)
              .pipe(first())
              .toPromise();
            return this.bandProtocolService.convertToUSDAmount(
              symbol.name,
              (
                Number(vault.total_bonded_amount) +
                Number(vault.total_unbonding_amount) +
                Number(vault.total_withdrawal_balance)
              ).toString(),
              symbolMetadataMap,
            );
          }),
        ),
      ),
    );
    this.apy$ = combineLatest([this.vaults$, this.configService.config$]).pipe(
      mergeMap(async ([vaults, config]) =>
        Promise.all(
          vaults.map(async (vault) => {
            // TODO: go to a function
            // same in vault.component.ts
            if (!vault.strategy_weights) {
              return 0;
            }
            let vaultAPY = 0;
            for (const strategyWeight of vault.strategy_weights) {
              const strategyInfo = config?.strategiesInfo?.find(
                (strategyInfo) => strategyInfo.id === strategyWeight.strategy_id,
              );
              const strategyAPY = await this.iyaService.getStrategyAPR(strategyInfo);
              vaultAPY += Number(strategyAPY) * Number(strategyWeight.weight);
            }
            return vaultAPY;
          }),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  appSearchValueChanged(value: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword: value,
      },
      queryParamsHandling: 'merge',
    });
  }
}
