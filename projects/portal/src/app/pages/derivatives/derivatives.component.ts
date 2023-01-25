import { TokenInfo } from '../../views/derivatives/derivatives.component';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-derivatives',
  templateUrl: './derivatives.component.html',
  styleUrls: ['./derivatives.component.css'],
})
export class DerivativesComponent implements OnInit {
  tokenInfos$: Observable<TokenInfo[]>;

  constructor() {
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
}
