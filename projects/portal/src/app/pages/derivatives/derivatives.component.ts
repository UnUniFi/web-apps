import { DerivativesQueryService } from '../../models/derivatives/derivatives.query.service';
import { TokenInfo } from '../../views/derivatives/derivatives.component';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  DerivativesParams200ResponseParams,
  PerpetualFutures200Response,
  Pool200Response,
} from 'ununifi-client/esm/openapi';

export interface TokenData {
  denom?: string;
  name?: string;
  symbol?: string;
  iconUrl?: string;
  quoteDenom?: string;
  price?: string;
  volume24h?: string;
  fees24h?: string;
}

@Component({
  selector: 'app-derivatives',
  templateUrl: './derivatives.component.html',
  styleUrls: ['./derivatives.component.css'],
})
export class DerivativesComponent implements OnInit {
  derivativesParams$: Observable<DerivativesParams200ResponseParams>;
  pool$: Observable<Pool200Response>;
  perpetualFuturesParams$: Observable<PerpetualFutures200Response>;
  tokens$: Observable<TokenData[]>;
  tokenInfos$: Observable<TokenInfo[]>;

  constructor(private derivativesQuery: DerivativesQueryService) {
    this.derivativesParams$ = this.derivativesQuery.getDerivativesParams$();
    this.derivativesParams$.subscribe((a) => console.log(a));
    this.pool$ = this.derivativesQuery.getPool$();
    this.pool$.subscribe((a) => console.log(a));
    this.perpetualFuturesParams$ = this.derivativesQuery.getWholePerpetualFutures$();
    this.perpetualFuturesParams$.subscribe((a) => console.log(a));
    this.tokens$ = this.derivativesParams$.pipe(
      map((params) => params.perpetual_futures?.markets!),
      mergeMap((markets) =>
        Promise.all(
          markets.map((market) =>
            this.derivativesQuery
              .getPerpetualFuture$(market.denom!, market.quote_denom!)
              .toPromise()
              .then((res) => {
                const info = this.getTokenInfo(market.denom!);
                return {
                  denom: market.denom,
                  name: info?.name,
                  symbol: info?.symbol,
                  iconUrl: info?.iconUrl,
                  quoteDenom: market.quote_denom,
                  price: res.price,
                  volume24h: res.volume_24hours,
                  fees24h: res.fees_24hours,
                };
              }),
          ),
        ),
      ),
    );
    this.tokenInfos$ = of([
      {
        name: 'UnUniFi',
        symbol: 'GUU',
        iconUrl:
          'https://dd7tel2830j4w.cloudfront.net/f1661485412830x686261173127874400/UnUniFi-logo.png',
        price: '5',
        pool: '1000',
        weight: '2.5',
      },
      {
        name: 'Cosmos',
        symbol: 'ATOM',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg',
        price: '12.6',
        pool: '10000',
        weight: '16.5',
      },
      {
        name: 'Ethereum',
        symbol: 'ETH',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg',
        price: '1540',
        pool: '20000',
        weight: '25.56',
      },
      {
        name: 'Bitcoin',
        symbol: 'BTC',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg',
        price: '22622',
        pool: '35000',
        weight: '36.8',
      },
      {
        name: 'USD coin',
        symbol: 'USDC',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg',
        price: '1.00',
        pool: '64000',
        weight: '46.8',
      },
    ]);
  }

  ngOnInit(): void {}

  getTokenInfo(denom: string) {
    const tokens = [
      {
        denom: 'uguu',
        name: 'UnUniFi',
        symbol: 'GUU',
        iconUrl:
          'https://dd7tel2830j4w.cloudfront.net/f1661485412830x686261173127874400/UnUniFi-logo.png',
      },
      {
        denom: 'uatom',
        name: 'Cosmos',
        symbol: 'ATOM',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg',
      },
      {
        denom: 'ueth',
        name: 'Ethereum',
        symbol: 'ETH',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg',
      },
      {
        denom: 'ubtc',
        name: 'Bitcoin',
        symbol: 'BTC',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg',
      },
      {
        denom: 'uusdc',
        name: 'USD coin',
        symbol: 'USDC',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/usdc.svg',
      },
    ];
    return tokens.find((token) => token.denom == denom);
  }
}
