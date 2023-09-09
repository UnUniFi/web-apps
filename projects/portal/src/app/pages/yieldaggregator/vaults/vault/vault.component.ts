import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  BandProtocolService,
  TokenAmountUSD,
} from 'projects/portal/src/app/models/band-protocols/band-protocol.service';
import { ConfigService, YieldInfo } from 'projects/portal/src/app/models/config.service';
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { WalletApplicationService } from 'projects/portal/src/app/models/wallets/wallet.application.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.application.service';
import {
  DepositToVaultRequest,
  WithdrawFromVaultRequest,
} from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.model';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.query.service';
import { YieldAggregatorService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.service';
import { ExternalChain } from 'projects/portal/src/app/views/yieldaggregator/vaults/vault/vault.component';
import { BehaviorSubject, combineLatest, Observable, of, timer } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  EstimateMintAmount200Response,
  EstimateRedeemAmount200Response,
  Vault200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  address$: Observable<string>;
  vault$: Observable<Vault200Response>;
  denom$: Observable<string | undefined>;
  denomBalancesMap$: Observable<{ [symbol: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  denomMetadataMap$: Observable<{
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;
  symbolImage$: Observable<string | null>;
  mintAmount$: BehaviorSubject<number>;
  burnAmount$: BehaviorSubject<number>;
  totalDepositAmount$: Observable<TokenAmountUSD>;
  totalBondedAmount$: Observable<TokenAmountUSD>;
  totalUnbondingAmount$: Observable<TokenAmountUSD>;
  withdrawReserve$: Observable<TokenAmountUSD>;
  estimatedMintAmount$: Observable<EstimateMintAmount200Response>;
  estimatedRedeemAmount$: Observable<EstimateRedeemAmount200Response>;
  vaultBalance$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;
  usdDepositAmount$: Observable<TokenAmountUSD>;
  vaultInfo$: Observable<YieldInfo>;
  externalWalletAddress: string | undefined;

  constructor(
    private route: ActivatedRoute,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaApp: YieldAggregatorApplicationService,
    private readonly iyaService: YieldAggregatorService,
    private readonly walletService: WalletService,
    private readonly walletApp: WalletApplicationService,
    private readonly bankQuery: BankQueryService,
    private readonly bandProtocolService: BandProtocolService,
    private readonly configService: ConfigService,
  ) {
    const vaultId$ = this.route.params.pipe(map((params) => params.vault_id));
    this.vault$ = vaultId$.pipe(mergeMap((id) => this.iyaQuery.getVault$(id)));
    this.denom$ = this.vault$.pipe(map((vault) => vault.vault?.denom));
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.denomBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getDenomBalanceMap$(address)),
    );
    this.denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();

    const timer$ = timer(0, 1000 * 60);
    this.totalDepositAmount$ = combineLatest([timer$, this.vault$, this.denomMetadataMap$]).pipe(
      mergeMap(([_, vault, denomMetadataMap]) =>
        this.bandProtocolService.convertToUSDAmountDenom(
          vault.vault?.denom!,
          (
            Number(vault.total_bonded_amount) +
            Number(vault.total_unbonding_amount) +
            Number(vault.withdraw_reserve)
          ).toString(),
          denomMetadataMap,
        ),
      ),
    );
    this.totalBondedAmount$ = combineLatest([timer$, this.vault$, this.denomMetadataMap$]).pipe(
      mergeMap(([_, vault, denomMetadataMap]) =>
        this.bandProtocolService.convertToUSDAmountDenom(
          vault.vault?.denom!,
          vault.total_bonded_amount!,
          denomMetadataMap,
        ),
      ),
    );
    this.totalUnbondingAmount$ = combineLatest([timer$, this.vault$, this.denomMetadataMap$]).pipe(
      mergeMap(([_, vault, denomMetadataMap]) =>
        this.bandProtocolService.convertToUSDAmountDenom(
          vault.vault?.denom!,
          vault.total_unbonding_amount!,
          denomMetadataMap,
        ),
      ),
    );
    this.withdrawReserve$ = combineLatest([timer$, this.vault$, this.denomMetadataMap$]).pipe(
      mergeMap(([_, vault, denomMetadataMap]) =>
        this.bandProtocolService.convertToUSDAmountDenom(
          vault.vault?.denom!,
          vault.withdraw_reserve!,
          denomMetadataMap,
        ),
      ),
    );

    const symbol$ = combineLatest([this.vault$, this.denomMetadataMap$]).pipe(
      map(([vault, denomMetadataMap]) => denomMetadataMap?.[vault.vault?.denom!].symbol || ''),
    );
    this.symbolImage$ = symbol$.pipe(
      map((symbol) => (symbol ? this.bankQuery.getSymbolImageMap()[symbol] || '' : null)),
    );
    this.mintAmount$ = new BehaviorSubject(0);
    this.burnAmount$ = new BehaviorSubject(0);
    this.estimatedMintAmount$ = combineLatest([this.vault$, this.mintAmount$.asObservable()]).pipe(
      mergeMap(([vault, deposit]) => {
        // return this.iyaService.estimateMintAmount$(vault, deposit);
        const id = vault.vault?.id;
        if (!id) {
          return of({ mint_amount: { amount: '0', denom: '' } });
        }
        const exponent = getDenomExponent(vault.vault?.denom);
        return this.iyaQuery.getEstimatedMintAmount$(id, (deposit * 10 ** exponent).toString());
      }),
    );
    this.estimatedRedeemAmount$ = combineLatest([
      this.vault$,
      this.burnAmount$.asObservable(),
    ]).pipe(
      mergeMap(([vault, burn]) => {
        // return this.iyaService.estimateRedeemAmount$(vault, burn);
        const id = vault.vault?.id;
        if (!id) {
          return of({ redeem_amount: { amount: '0', denom: '' } });
        }
        const exponent = getDenomExponent('yieldaggregator/vaults/' + id);
        return this.iyaQuery.getEstimatedRedeemAmount$(id, (burn * 10 ** exponent).toString());
      }),
    );
    this.vaultInfo$ = combineLatest([this.vault$, this.configService.config$]).pipe(
      mergeMap(async ([vault, config]) => this.iyaService.calcVaultAPY(vault, config)),
    );
    const balances$ = this.address$.pipe(mergeMap((addr) => this.bankQuery.getBalance$(addr)));
    this.vaultBalance$ = combineLatest([vaultId$, balances$]).pipe(
      map(([id, balances]) => {
        const balance = balances.find((balance) =>
          balance.denom?.includes('yieldaggregator/vaults/' + id),
        );
        if (!balance) {
          return {
            denom: 'yieldaggregator/vaults/' + id,
            amount: '0',
          };
        }
        return balance;
      }),
    );
    this.usdDepositAmount$ = combineLatest([
      vaultId$,
      this.vaultBalance$,
      this.denomMetadataMap$,
    ]).pipe(
      mergeMap(async ([id, balance, denomMetadataMap]) => {
        const redeemAmount = await this.iyaQuery.getEstimatedRedeemAmount(id, balance?.amount!);
        return this.bandProtocolService.convertToUSDAmountDenom(
          redeemAmount.total_amount?.denom!,
          redeemAmount.total_amount?.amount!,
          denomMetadataMap,
        );
      }),
    );
  }

  ngOnInit(): void {}

  onChangeDeposit(amount: number) {
    this.mintAmount$.next(amount);
  }

  onSubmitDeposit(data: DepositToVaultRequest) {
    this.iyaApp.depositToVault(data.vaultId, data.denom, data.readableAmount);
  }

  onChangeWithdraw(amount: number) {
    this.burnAmount$.next(amount);
  }

  onSubmitWithdraw(data: WithdrawFromVaultRequest) {
    this.iyaApp.withdrawFromVault(data.vaultId, data.denom, data.readableAmount);
  }

  async onClickChain(chain: ExternalChain) {
    this.externalWalletAddress = await this.walletApp.getExternalWallet(chain);
  }
}
