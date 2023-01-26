import { Component, Input, OnInit } from '@angular/core';

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
  tokenInfos?: TokenInfo[] | null;

  configs: MarketConfig[];
  selectedConfig: MarketConfig;

  constructor() {
    this.configs = [
      {
        name: 'Perpetual Futures',
        route: '/derivatives/perpetual-futures',
        description:
          'A perpetual futures contract is a special type of futures contract. It does not have an expiry date unlike the traditional one. So you can hold a position for as long as you like.',
      },
    ];
    this.selectedConfig = this.configs[0];
  }

  ngOnInit(): void {}

  onChangeConfig(conf: MarketConfig) {
    this.selectedConfig = conf;
  }
}
