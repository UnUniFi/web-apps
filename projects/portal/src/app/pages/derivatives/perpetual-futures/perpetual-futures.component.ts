import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { DerivativesQueryService } from '../../../models/derivatives/derivatives.query.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import ununificlient from 'ununifi-client';

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
    map(([params, metadata]) => params?.markets?.map((market) => this.getMarket(metadata, market))),
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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bankQuery: BankQueryService,
    private readonly derivativesQuery: DerivativesQueryService,
  ) {}

  ngOnInit(): void {}

  onChangeMarket(market: string) {
    const slashIndex = market.indexOf('/');
    const base = market.slice(0, slashIndex);
    const quote = market.slice(slashIndex + 1);
    this.router.navigate(['/derivatives/perpetual-futures', base, quote]);
  }

  getMarket(
    denomMetadataMap: {
      [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
    },
    market: ununificlient.proto.ununifi.derivatives.IMarket,
  ) {
    const baseMetadata = denomMetadataMap?.[market.base_denom || ''];
    const quoteMetadata = denomMetadataMap?.[market.quote_denom || ''];
    if (baseMetadata && quoteMetadata) {
      return baseMetadata.symbol + '/' + quoteMetadata.symbol;
    } else {
      return market.base_denom + '/' + market.quote_denom;
    }
  }
}
