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
  description: string;
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
          'A perpetual futures contract is a special type of futures contract. It does not have an expiry date unlike the traditional one. So you can hold a position for as long as you like. The trading of perpetual contracts is based on an underlying Index Price.',
      },
      {
        name: 'Perpetual Options (Coming soon)',
        route: '/derivatives/perpetual-options',
        description:
          'A perpetual option (XPO) is a non-standard financial option that has no fixed maturity and no exercise limitation. While the life of a standard option can range from a few days to several years, a perpetual option (XPO) can be exercised at any time and without any expiration.',
      },
    ];
    this.selectedConfig = this.configs[0];
  }

  ngOnInit(): void {}

  onChangeConfig(conf: MarketConfig) {
    this.selectedConfig = conf;
  }
}
