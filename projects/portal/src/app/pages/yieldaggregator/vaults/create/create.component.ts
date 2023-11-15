import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
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
  symbol$: Observable<string>;
  availableTokens$: Observable<cosmosclient.proto.cosmos.bank.v1beta1.IMetadata[]>;
  strategies$: Observable<StrategyAll200ResponseStrategiesInner[]>;
  denomBalancesMap$: Observable<{ [symbol: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  denomMetadataMap$: Observable<{
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;
  commissionRate$: Observable<number>;
  deposit$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;
  fee$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly walletService: WalletService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaApp: YieldAggregatorApplicationService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );

    this.symbol$ = this.route.queryParams.pipe(map((params) => params.symbol));
    const allStrategies$ = this.iyaQuery.listStrategies$();
    this.strategies$ = combineLatest([this.symbol$, allStrategies$]).pipe(
      map(([symbol, allStrategies]) => {
        if (!symbol) {
          return allStrategies;
        }
        return allStrategies.filter((strategy) => strategy.symbol === symbol);
      }),
    );
    this.denomBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getDenomBalanceMap$(address)),
    );
    this.denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.availableTokens$ = combineLatest([allStrategies$, this.denomMetadataMap$]).pipe(
      map(([allStrategies, denomMetadataMap]) => {
        const symbols = allStrategies
          .map((strategy) => denomMetadataMap[strategy.strategy?.denom || ''])
          .filter((metadata) => metadata !== undefined);
        return [...new Set(symbols)];
      }),
    );
    const params$ = this.iyaQuery.getYieldAggregatorParam$();
    this.commissionRate$ = params$.pipe(map((params) => Number(params.commission_rate) * 100));
    this.deposit$ = params$.pipe(map((params) => params.vault_creation_deposit!));
    this.fee$ = params$.pipe(map((params) => params.vault_creation_fee!));
  }

  ngOnInit(): void {}

  onChangeSymbol(symbol: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        symbol: symbol,
      },
      queryParamsHandling: 'merge',
    });
  }

  onCreate(data: CreateVaultRequest) {
    this.iyaApp.createVault(
      data.name,
      data.symbol,
      data.description,
      data.strategies,
      data.commissionRate,
      data.reserveRate,
      data.fee,
      data.deposit,
      data.feeCollectorAddress,
    );
  }
}
