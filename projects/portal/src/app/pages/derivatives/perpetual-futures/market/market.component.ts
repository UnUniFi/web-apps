import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { DerivativesApplicationService } from 'projects/portal/src/app/models/derivatives/derivatives.application.service';
import { DerivativesQueryService } from 'projects/portal/src/app/models/derivatives/derivatives.query.service';
import { DerivativesService } from 'projects/portal/src/app/models/derivatives/derivatives.service';
import { PricefeedQueryService } from 'projects/portal/src/app/models/pricefeeds/pricefeed.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { OpenPositionEvent } from 'projects/portal/src/app/views/derivatives/perpetual-futures/market/market.component';
import { BehaviorSubject, combineLatest, Observable, timer, zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import ununificlient from 'ununifi-client';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
})
export class MarketComponent implements OnInit {
  selectedMarket$ = this.route.params.pipe(
    map((params) => params.baseSymbol + '/' + params.quoteSymbol),
  );
  baseSymbol$ = this.route.params.pipe(map((params) => params.baseSymbol));
  baseImage$ = this.baseSymbol$.pipe(
    map((symbol) => this.bankQuery.symbolImages().find((i) => i.symbol === symbol)?.image),
  );
  quoteSymbol$ = this.route.params.pipe(map((params) => params.quoteSymbol));
  quoteImage$ = this.quoteSymbol$.pipe(
    map((symbol) => this.bankQuery.symbolImages().find((i) => i.symbol === symbol)?.image),
  );

  address$ = this.walletService.currentStoredWallet$.pipe(
    filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
    map((wallet) => wallet.address),
  );

  params$ = this.derivativesQuery.getDerivativesParams$();
  denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
  availableMarkets$ = combineLatest([this.params$, this.denomMetadataMap$]).pipe(
    map(([params, metadata]) =>
      this.derivatives.listAvailableMarkets(metadata, params.perpetual_futures?.markets || []),
    ),
  );

  symbolBalancesMap$ = this.address$.pipe(
    mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
  );
  symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
  baseDenom$ = combineLatest([this.baseSymbol$, this.symbolMetadataMap$]).pipe(
    map(([baseSymbol, symbolMetadataMap]) => symbolMetadataMap[baseSymbol].base),
  );
  quoteDenom$ = combineLatest([this.quoteSymbol$, this.symbolMetadataMap$]).pipe(
    map(([quoteSymbol, symbolMetadataMap]) => symbolMetadataMap[quoteSymbol].base),
  );

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

  markets$ = this.pricefeedQuery.listAllMarkets$();
  marketId$ = combineLatest([this.markets$, this.baseDenom$, this.quoteDenom$]).pipe(
    map(
      ([markets, base, quote]) =>
        markets.find((market) => market.base_asset == base && market.quote_asset == quote)
          ?.market_id,
    ),
  );
  timer$ = timer(0, 1000 * 30);
  basePrice$ = combineLatest([this.baseDenom$, this.timer$]).pipe(
    mergeMap(([denom, _]) => this.pricefeedQuery.getPrice$(denom + ':usd')),
  );
  quotePrice$ = combineLatest([this.quoteDenom$, this.timer$]).pipe(
    mergeMap(([denom, _]) => this.pricefeedQuery.getPrice$(denom + ':usd')),
  );
  price$ = combineLatest([this.basePrice$, this.quotePrice$]).pipe(
    map(([base, quote]) => Number(base.price) / Number(quote.price)),
  );

  positions$ = combineLatest([this.address$, this.timer$]).pipe(
    mergeMap(([address, _]) => this.derivativesQuery.listAddressPositions$(address)),
    map((positions) =>
      positions.filter((position) => {
        const positionInstance = cosmosclient.codec.protoJSONToInstance(
          position.position?.position_instance as any,
        );
        return (
          positionInstance instanceof
          ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance
        );
      }),
    ),
  );

  positionInstances$: Observable<
    (ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance | undefined)[]
  > = this.positions$.pipe(
    map((positions) =>
      positions.map((position) => {
        const instance = cosmosclient.codec.protoJSONToInstance(
          position.position?.position_instance as any,
        );
        if (
          instance instanceof
          ununificlient.proto.ununifi.derivatives.PerpetualFuturesPositionInstance
        ) {
          return instance;
        } else {
          return undefined;
        }
      }),
    ),
  );

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly pricefeedQuery: PricefeedQueryService,
    private readonly derivatives: DerivativesService,
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

  async onClosePosition($event: string) {
    await this.derivativesApplication.closePosition($event);
  }

  onChangeMarket(market: string) {
    const slashIndex = market.indexOf('/');
    const base = market.slice(0, slashIndex);
    const quote = market.slice(slashIndex + 1);
    this.router.navigate(['/derivatives/perpetual-futures', base, quote]);
  }
}
