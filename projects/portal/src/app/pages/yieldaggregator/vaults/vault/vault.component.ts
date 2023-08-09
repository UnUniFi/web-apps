import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { cosmos } from '@cosmos-client/core/esm/proto';
import {
  BandProtocolService,
  TokenAmountUSD,
} from 'projects/portal/src/app/models/band-protocols/band-protocol.service';
import { ConfigService } from 'projects/portal/src/app/models/config.service';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.application.service';
import {
  DepositToVaultRequest,
  WithdrawFromVaultRequest,
} from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.model';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.query.service';
import { YieldAggregatorService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.service';
import { BehaviorSubject, combineLatest, Observable, of, timer } from 'rxjs';
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
  totalDepositAmount$: Observable<TokenAmountUSD>;
  totalBondedAmount$: Observable<TokenAmountUSD>;
  totalUnbondingAmount$: Observable<TokenAmountUSD>;
  totalWithdrawalBalance$: Observable<TokenAmountUSD>;
  estimatedMintAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;
  estimatedBurnAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;
  vaultAPY$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaApp: YieldAggregatorApplicationService,
    private readonly iyaService: YieldAggregatorService,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly bandProtocolService: BandProtocolService,
    private readonly configService: ConfigService,
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
      map(([vault, denomMetadataMap]) =>
        denomMetadataMap?.[vault.vault?.denom!].symbol?.replace(/\s*\([^)]*\)/g, ''),
      ),
    );
    const timer$ = timer(0, 1000 * 60);
    this.totalDepositAmount$ = combineLatest([
      timer$,
      this.symbol$,
      this.vault$,
      this.symbolMetadataMap$,
    ]).pipe(
      mergeMap(([_, symbol, vault, symbolMetadataMap]) =>
        this.bandProtocolService.convertToUSDAmount(
          symbol!,
          (
            Number(vault.total_bonded_amount) +
            Number(vault.total_unbonding_amount) +
            Number(vault.total_withdrawal_balance)
          ).toString(),
          symbolMetadataMap,
        ),
      ),
    );
    this.totalBondedAmount$ = combineLatest([
      timer$,
      this.symbol$,
      this.vault$,
      this.symbolMetadataMap$,
    ]).pipe(
      mergeMap(([_, symbol, vault, symbolMetadataMap]) =>
        this.bandProtocolService.convertToUSDAmount(
          symbol!,
          vault.total_bonded_amount!,
          symbolMetadataMap,
        ),
      ),
    );
    this.totalUnbondingAmount$ = combineLatest([
      timer$,
      this.symbol$,
      this.vault$,
      this.symbolMetadataMap$,
    ]).pipe(
      mergeMap(([_, symbol, vault, symbolMetadataMap]) =>
        this.bandProtocolService.convertToUSDAmount(
          symbol!,
          vault.total_unbonding_amount!,
          symbolMetadataMap,
        ),
      ),
    );
    this.totalWithdrawalBalance$ = combineLatest([
      timer$,
      this.symbol$,
      this.vault$,
      this.symbolMetadataMap$,
    ]).pipe(
      mergeMap(([_, symbol, vault, symbolMetadataMap]) =>
        this.bandProtocolService.convertToUSDAmount(
          symbol!,
          vault.total_withdrawal_balance!,
          symbolMetadataMap,
        ),
      ),
    );

    this.symbolImage$ = this.symbol$.pipe(
      map((symbol) => (symbol ? this.bankQuery.getSymbolImageMap()[symbol] : null)),
    );
    this.mintAmount$ = new BehaviorSubject(0);
    this.burnAmount$ = new BehaviorSubject(0);
    this.estimatedMintAmount$ = combineLatest([this.vault$, this.mintAmount$.asObservable()]).pipe(
      mergeMap(([vault, deposit]) => {
        return this.iyaService.estimateMintAmount$(vault, deposit);
        // const exponent = getDenomExponent(vault.vault?.denom);
        // return this.iyaQuery.getEstimatedMintAmount$(id, (deposit * 10 ** exponent).toString());
      }),
    );
    this.estimatedBurnAmount$ = combineLatest([this.vault$, this.burnAmount$.asObservable()]).pipe(
      mergeMap(([vault, burn]) => {
        return this.iyaService.estimateRedeemAmount$(vault, burn);
        // return this.iyaQuery.getEstimatedRedeemAmount$(id, burn.toString());
      }),
    );
    this.vaultAPY$ = combineLatest([this.vault$, this.configService.config$]).pipe(
      map(([vault, config]) => {
        if (!vault.vault?.strategy_weights) {
          return 0;
        }
        let vaultAPY = 0;
        for (const strategyWeight of vault.vault.strategy_weights) {
          const strategyAPY = config?.strategiesInfo?.find(
            (strategyInfo) => strategyInfo.id === strategyWeight.strategy_id,
          )?.apy;
          vaultAPY += Number(strategyAPY) * Number(strategyWeight.weight);
        }
        return vaultAPY;
      }),
    );
  }

  ngOnInit(): void {}

  onChangeDeposit(amount: number) {
    this.mintAmount$.next(amount);
  }

  onSubmitDeposit(data: DepositToVaultRequest) {
    this.iyaApp.depositToVault(data.vaultId, data.symbol, data.amount);
  }

  onChangeWithdraw(amount: number) {
    this.burnAmount$.next(amount);
  }

  onSubmitWithdraw(data: WithdrawFromVaultRequest) {
    this.iyaApp.withdrawFromVault(data.vaultId, data.symbol, data.amount);
  }
}
