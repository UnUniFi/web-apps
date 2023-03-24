import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { cosmos } from '@cosmos-client/core/esm/proto';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.application.service';
import { CreateVaultRequest } from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  denom$: Observable<string>;
  strategies$: Observable<StrategyAll200ResponseStrategiesInner[]>;
  symbolBalancesMap$: Observable<{ [symbol: string]: number }>;
  symbolMetadataMap$: Observable<{ [symbol: string]: cosmos.bank.v1beta1.IMetadata }>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly walletService: WalletService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaApp: YieldAggregatorApplicationService,
  ) {
    const address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.denom$ = this.route.queryParams.pipe(map((params) => params.denom));
    this.strategies$ = this.denom$.pipe(mergeMap((denom) => this.iyaQuery.listStrategies$(denom)));
    this.symbolBalancesMap$ = address$.pipe(
      mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
    );
    this.symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
  }

  ngOnInit(): void {}

  onChangeDenom(denom: string): void {
    console.log('denom');
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
      data.feeAmount,
      data.depositAmount,
    );
  }
}
