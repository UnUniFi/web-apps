import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { DerivativesApplicationService } from 'projects/portal/src/app/models/derivatives/derivatives.application.service';
import { DerivativesQueryService } from 'projects/portal/src/app/models/derivatives/derivatives.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { OpenPositionEvent } from 'projects/portal/src/app/views/derivatives/perpetual-futures/market/market.component';
import { BehaviorSubject, combineLatest, zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
})
export class MarketComponent implements OnInit {
  baseSymbol$ = this.route.params.pipe(map((params) => params.baseSymbol));
  quoteSymbol$ = this.route.params.pipe(map((params) => params.quoteSymbol));

  address$ = this.walletService.currentStoredWallet$.pipe(
    filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
    map((wallet) => wallet.address),
  );

  params$ = this.derivativesQuery.getDerivativesParams$();

  symbolBalancesMap$ = this.address$.pipe(
    mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
  );
  symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();

  info$ = zip(this.baseSymbol$, this.quoteSymbol$, this.symbolMetadataMap$).pipe(
    mergeMap(([baseSymbol, quoteSymbol, symbolMetadataMap]) =>
      this.derivativesQuery.getPerpetualFuture$(
        symbolMetadataMap[baseSymbol].base!,
        symbolMetadataMap[quoteSymbol].base!,
      ),
    ),
  );

  isLong$ = new BehaviorSubject(true);

  pools$ = this.derivativesQuery.getPool$();

  pool$ = combineLatest([
    this.pools$,
    this.baseSymbol$,
    this.quoteSymbol$,
    this.symbolMetadataMap$,
    this.isLong$,
  ]).pipe(
    map(([pools, baseSymbol, quoteSymbol, symbolMetadataMap, isLong]) => {
      let selectDenom = symbolMetadataMap[baseSymbol].base!;
      if (isLong) {
        selectDenom = symbolMetadataMap[quoteSymbol].base!;
      }
      return pools.pool_market_cap?.breakdown?.find((pool) => pool.denom == selectDenom);
    }),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly derivativesQuery: DerivativesQueryService,
    private readonly derivativesApplication: DerivativesApplicationService,
  ) {}

  ngOnInit(): void {}

  async onOpenPosition($event: OpenPositionEvent) {
    await this.derivativesApplication.openPerpetualFuturesPosition(
      $event.marginSymbol,
      $event.marginAmount,
      $event.baseSymbol,
      $event.quoteSymbol,
      $event.positionType,
      $event.size,
      $event.leverage,
    );
  }
}
