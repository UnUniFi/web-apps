import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { BankService } from '../../../models/cosmos/bank.service';
import { DerivativesApplicationService } from '../../../models/derivatives/derivatives.application.service';
import { DerivativesQueryService } from '../../../models/derivatives/derivatives.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { BurnLPTEvent, MintLPTEvent } from '../../../views/derivatives/pool/pool.component';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  pool$ = this.derivativesQuery.getPool$();
  params$ = this.derivativesQuery.getDerivativesParams$().pipe(map((params) => params.pool_params));
  denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
  // TODO: route guard for wallet may be needed
  address$ = this.walletService.currentStoredWallet$.pipe(
    filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
    map((wallet) => wallet.address),
  );
  symbolBalancesMap$ = this.address$.pipe(
    mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
  );
  symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
  mintAmount: BehaviorSubject<MintLPTEvent> = new BehaviorSubject<MintLPTEvent>({
    amount: 1,
    symbol: 'BTC',
  });
  burnAmount: BehaviorSubject<BurnLPTEvent> = new BehaviorSubject<BurnLPTEvent>({
    amount: 1,
    redeemSymbol: 'BTC',
  });

  estimatedLPTAmount$ = combineLatest([
    this.mintAmount.asObservable(),
    this.symbolMetadataMap$,
  ]).pipe(
    mergeMap(([mintAmount, symbolMetadataMap]) => {
      const coin = this.bankService.convertSymbolAmountMapToCoins(
        { [mintAmount.symbol]: mintAmount.amount },
        symbolMetadataMap,
      )[0];
      if (coin.denom && coin.amount) {
        return this.derivativesQuery.getEstimateDLPTokenAmount(coin.denom, coin.amount);
      } else {
        return of(undefined);
      }
    }),
  );

  estimatedRedeemAmount$ = combineLatest([
    this.burnAmount.asObservable(),
    this.symbolMetadataMap$,
  ]).pipe(
    mergeMap(([burnAmount, symbolMetadataMap]) => {
      const dlpCoin = this.bankService.convertSymbolAmountMapToCoins(
        { ['DLP']: burnAmount.amount },
        symbolMetadataMap,
      )[0];
      const redeemCoin = this.bankService.convertSymbolAmountMapToCoins(
        { [burnAmount.redeemSymbol]: 1 },
        symbolMetadataMap,
      )[0];
      if (dlpCoin.amount && redeemCoin.denom) {
        return this.derivativesQuery.getEstimateRedeemTokenAmount(redeemCoin.denom, dlpCoin.amount);
      } else {
        return of(undefined);
      }
    }),
  );

  constructor(
    private readonly walletService: WalletService,
    private readonly derivativesQuery: DerivativesQueryService,
    private readonly bankService: BankService,
    private readonly bankQuery: BankQueryService,
    private readonly derivativesApplication: DerivativesApplicationService,
  ) {}

  ngOnInit(): void {}

  onEstimateMint($event: MintLPTEvent) {
    this.mintAmount.next($event);
  }

  onEstimateBurn($event: BurnLPTEvent) {
    this.burnAmount.next($event);
  }

  async onMintLPT($event: MintLPTEvent) {
    await this.derivativesApplication.mintLiquidityProviderToken($event.symbol, $event.amount);
  }

  async onBurnLPT($event: BurnLPTEvent) {
    await this.derivativesApplication.burnLiquidityProviderToken(
      $event.amount,
      $event.redeemSymbol,
    );
  }
}
