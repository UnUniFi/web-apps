import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cosmos } from '@cosmos-client/core/esm/proto';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { BankService } from 'projects/portal/src/app/models/cosmos/bank.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.application.service';
import { CreateVaultRequest } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.model';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.query.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  address$: Observable<string>;
  denom$: Observable<string>;
  availableSymbols$: Observable<({ symbol: string; display: string } | undefined)[]>;
  selectedSymbol$: Observable<string | undefined>;
  strategies$: Observable<StrategyAll200ResponseStrategiesInner[]>;
  symbolBalancesMap$: Observable<{ [symbol: string]: number }>;
  symbolMetadataMap$: Observable<{ [symbol: string]: cosmos.bank.v1beta1.IMetadata }>;
  commissionRate$: Observable<number>;
  deposit$: Observable<{ symbol: string; amount: number }>;
  fee$: Observable<{ symbol: string; amount: number }>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly bank: BankService,
    private readonly bankQuery: BankQueryService,
    private readonly walletService: WalletService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaApp: YieldAggregatorApplicationService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.denom$ = this.route.queryParams.pipe(map((params) => params.denom));
    this.strategies$ = this.denom$.pipe(mergeMap((denom) => this.iyaQuery.listStrategies$(denom)));
    const allStrategies$ = this.iyaQuery.listStrategies$();
    this.symbolBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
    );
    this.symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.availableSymbols$ = combineLatest([allStrategies$, denomMetadataMap$]).pipe(
      map(([allStrategies, denomMetadataMap]) => {
        const symbols = allStrategies
          .map((strategy) => {
            const denomMetadata = denomMetadataMap[strategy.denom || ''];
            if (denomMetadata) {
              return {
                symbol: denomMetadata.symbol!,
                display: denomMetadata.display!,
              };
            } else {
              return undefined;
            }
          })
          .filter((symbol) => symbol !== undefined);
        return [...new Set(symbols)];
      }),
    );
    this.availableSymbols$.subscribe((symbols) => console.log(symbols));

    this.selectedSymbol$ = combineLatest([this.denom$, denomMetadataMap$]).pipe(
      map(([denom, denomMetadataMap]) => {
        if (denom && denomMetadataMap) {
          return denomMetadataMap[denom].symbol || undefined;
        } else {
          return undefined;
        }
      }),
    );
    const params$ = this.iyaQuery.getYieldAggregatorParam$();
    this.commissionRate$ = params$.pipe(map((params) => Number(params.commission_rate) * 100));
    this.deposit$ = combineLatest([params$, denomMetadataMap$]).pipe(
      map(([params, denomMetadataMap]) =>
        this.bank.convertCoinToSymbolAmount(params.vault_creation_deposit!, denomMetadataMap),
      ),
    );
    this.fee$ = combineLatest([params$, denomMetadataMap$]).pipe(
      map(([params, denomMetadataMap]) =>
        this.bank.convertCoinToSymbolAmount(params.vault_creation_fee!, denomMetadataMap),
      ),
    );
  }

  ngOnInit(): void {}

  onChangeDenom(denom: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        denom: denom,
      },
      queryParamsHandling: 'merge',
    });
  }

  onCreate(data: CreateVaultRequest) {
    this.iyaApp.createVault(
      data.name,
      data.symbol,
      data.strategies,
      data.commissionRate,
      data.reserveRate,
      data.feeAmount,
      data.feeSymbol,
      data.depositAmount,
      data.depositSymbol,
    );
  }
}
