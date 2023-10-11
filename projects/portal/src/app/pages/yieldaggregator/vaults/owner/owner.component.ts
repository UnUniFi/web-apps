import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.application.service';
import { TransferVaultRequest } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.model';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.query.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import {
  StrategyAll200ResponseStrategiesInner,
  VaultAll200ResponseVaultsInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css'],
})
export class OwnerComponent implements OnInit {
  address$: Observable<string>;
  owner$: Observable<string>;
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;
  symbols$: Observable<{ symbol: string; display: string; img: string }[]>;
  strategies$: Observable<StrategyAll200ResponseStrategiesInner[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaApp: YieldAggregatorApplicationService,
    private readonly bankQuery: BankQueryService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.owner$ = this.route.params.pipe(map((params) => params.address));
    this.vaults$ = combineLatest([this.iyaQuery.listVaults$(), this.owner$]).pipe(
      map(([vaults, owner]) => vaults.filter((vault) => vault.vault?.owner === owner)),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbols$ = combineLatest([this.vaults$, denomMetadataMap$]).pipe(
      map(([vaults, denomMetadataMap]) =>
        vaults.map((vault) => {
          const symbol = denomMetadataMap?.[vault.vault?.denom!]?.symbol || '';
          const display = denomMetadataMap?.[vault.vault?.denom!]?.display || vault.vault?.denom!;
          const img = this.bankQuery.getSymbolImageMap()[symbol] || '';
          return { symbol: symbol, display: display, img: img };
        }),
      ),
    );
    this.strategies$ = this.iyaQuery.listStrategies$();
  }

  ngOnInit(): void {}

  onTransfer(data: TransferVaultRequest) {
    this.iyaApp.transferVaultOwnership(data.vaultId, data.recipientAddress);
  }
}
