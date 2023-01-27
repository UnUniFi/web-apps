import { Component, OnInit } from '@angular/core';

export interface OptionConfig {
  name: string;
  route: string;
  description: string;
}

@Component({
  selector: 'view-yield-aggregator',
  templateUrl: './yield-aggregator.component.html',
  styleUrls: ['./yield-aggregator.component.css'],
})
export class YieldAggregatorComponent implements OnInit {
  configs: OptionConfig[];
  selectedConfig: OptionConfig;

  constructor() {
    this.configs = [
      {
        name: 'Vaults',
        route: 'vaults',
        description: 'Deposit tokens and receive yield.',
      },
    ];
    this.selectedConfig = this.configs[0];
  }

  ngOnInit(): void {}

  onChangeConfig(conf: OptionConfig) {
    this.selectedConfig = conf;
  }
}
