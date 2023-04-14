import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { cosmos } from '@cosmos-client/core/esm/proto';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.application.service';
import {
  DepositToVaultRequest,
  WithdrawFromVaultRequest,
} from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Vault200Response, VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  address$: Observable<string>;
  vault$: Observable<Vault200Response>;
  symbolBalancesMap$: Observable<{ [symbol: string]: number }>;
  symbolMetadataMap$: Observable<{ [symbol: string]: cosmos.bank.v1beta1.IMetadata }>;
  symbol$: Observable<string | null | undefined>;
  symbolImage$: Observable<string | null>;
  mintAmount$: BehaviorSubject<number>;
  burnAmount$: BehaviorSubject<number>;
  estimatedMintAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;
  estimatedBurnAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;

  constructor(
    private route: ActivatedRoute,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaApp: YieldAggregatorApplicationService,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
  ) {
    const vaultId$ = this.route.params.pipe(map((params) => params.vault_id));
    this.vault$ = vaultId$.pipe(mergeMap((id) => this.iyaQuery.getVault$(id)));
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.symbolBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
    );
    this.symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbol$ = combineLatest([this.vault$, denomMetadataMap$]).pipe(
      map(([vault, denomMetadataMap]) => denomMetadataMap?.[vault.vault?.denom!].symbol),
    );
    this.symbolImage$ = this.symbol$.pipe(
      map((symbol) => (symbol ? this.bankQuery.getSymbolImageMap()[symbol] : null)),
    );
    this.mintAmount$ = new BehaviorSubject(0);
    this.burnAmount$ = new BehaviorSubject(0);
    this.estimatedMintAmount$ = combineLatest([
      vaultId$,
      this.vault$,
      this.mintAmount$.asObservable(),
      denomMetadataMap$,
    ]).pipe(
      mergeMap(([id, vault, deposit, denomMetadataMap]) => {
        const exponent =
          denomMetadataMap?.[vault.vault?.denom!].denom_units?.find(
            (u) => u.denom == vault.vault?.denom,
          )?.exponent || 0;
        return this.iyaQuery.getEstimatedMintAmount$(id, (deposit * 10 ** exponent).toString());
      }),
    );
    this.estimatedBurnAmount$ = combineLatest([
      vaultId$,
      this.vault$,
      this.burnAmount$.asObservable(),
      denomMetadataMap$,
    ]).pipe(
      mergeMap(([id, vault, burn, denomMetadataMap]) => {
        return this.iyaQuery.getEstimatedRedeemAmount$(id, burn.toString());
      }),
    );
  }

  ngOnInit(): void {}

  onChangeDeposit(amount: number) {
    console.log('a');
    this.mintAmount$.next(amount);
  }

  onSubmitDeposit(data: DepositToVaultRequest) {
    this.iyaApp.depositToVault(data.vaultId, data.symbol, data.amount);
  }

  onChangeWithdraw(amount: number) {
    console.log('b');
    this.burnAmount$.next(amount);
  }

  onSubmitWithdraw(data: WithdrawFromVaultRequest) {
    this.iyaApp.withdrawFromVault(data.vaultId, data.symbol, data.amount);
  }
}
