import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { DerivativesQueryService } from '../../../models/derivatives/derivatives.query.service';
import { DerivativesService } from '../../../models/derivatives/derivatives.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-perpetual-futures',
  templateUrl: './perpetual-futures.component.html',
  styleUrls: ['./perpetual-futures.component.css'],
})
export class PerpetualFuturesComponent implements OnInit {
  info$ = this.derivativesQuery.getWholePerpetualFutures$();
  params$ = this.derivativesQuery
    .getDerivativesParams$()
    .pipe(map((params) => params.perpetual_futures));

  denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
  markets$ = combineLatest([this.params$, this.denomMetadataMap$]).pipe(
    map(([params, metadata]) =>
      this.derivatives.listAvailableMarkets(metadata, params?.markets || []),
    ),
  );
  selectedMarket$ = this.markets$.pipe(
    map((markets) => {
      if (markets && markets.length) {
        this.onChangeMarket(markets[0]);
        return markets[0];
      } else {
        return undefined;
      }
    }),
  );

  constructor(
    private readonly router: Router,
    private readonly bankQuery: BankQueryService,
    private readonly derivatives: DerivativesService,
    private readonly derivativesQuery: DerivativesQueryService,
  ) {}

  ngOnInit(): void {}

  onChangeMarket(market: string) {
    const slashIndex = market.indexOf('/');
    const base = market.slice(0, slashIndex);
    const quote = market.slice(slashIndex + 1);
    this.router.navigate(['/derivatives/perpetual-futures', base, quote]);
  }
}
