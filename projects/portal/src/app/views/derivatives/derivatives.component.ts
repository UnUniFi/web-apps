import { TokenData } from '../../pages/derivatives/derivatives.component';
import { Component, Input, OnInit } from '@angular/core';
import {
  DerivativesParams200ResponseParams,
  PerpetualFutures200Response,
  Pool200Response,
} from 'ununifi-client/esm/openapi';

export interface TokenInfo {
  name: string;
  symbol: string;
  iconUrl: string;
  price: string;
  pool: string;
  weight: string;
}

export interface MarketConfig {
  name: string;
  route: string;
  description?: string;
}

@Component({
  selector: 'view-derivatives',
  templateUrl: './derivatives.component.html',
  styleUrls: ['./derivatives.component.css'],
})
export class DerivativesComponent implements OnInit {
  @Input()
  derivativesParams?: DerivativesParams200ResponseParams | null;
  @Input()
  pool?: Pool200Response | null;
  @Input()
  perpetualFuturesParams?: PerpetualFutures200Response | null;
  @Input()
  tokens?: TokenData[] | null;

  @Input()
  tokenInfos?: TokenInfo[] | null;

  configs: MarketConfig[];
  selectedConfig: MarketConfig;

  constructor() {
    this.configs = [
      {
        name: 'Perpetual Futures',
        route: '/derivatives/perpetual-futures',
        description:
          'Perpetual futures are a type of cryptocurrency trading contract that allows traders to take positions on future price movements. These contracts have no expiration date, and traders are able to maintain positions indefinitely by depositing funds with the exchange. \nPerpetual futures contracts typically require margin, making them a high-risk, high-reward investment product. Additionally, leverage can be employed for these contracts, meaning even small price movements can result in significant gains or losses, necessitating careful trading practices.',
      },
      {
        name: 'Perpetual Options (Coming soon)',
        route: '/derivatives/perpetual-options',
        description:
          'Perpetual options are a type of cryptocurrency trading contract that allows traders to take positions on future price movements. These contracts have no expiration date, and traders are able to maintain positions indefinitely by depositing funds with the exchange. \nPerpetual options, like traditional options contracts, allow for the exchange of underlying and quote currencies, and the ability to settle prices at a specific future date. \nThese contracts come in two varieties, allowing traders to hedge against potential future price increases with purchasing options and against potential price decreases with selling options. \nPerpetual options trading comes with significant risk, and requires ample knowledge and experience. Proper utilization of exchange-provided margin and leverage is also critical.',
      },
    ];
    this.selectedConfig = this.configs[0];
  }

  ngOnInit(): void {}

  onChangeConfig(conf: MarketConfig) {
    this.selectedConfig = conf;
  }
}
