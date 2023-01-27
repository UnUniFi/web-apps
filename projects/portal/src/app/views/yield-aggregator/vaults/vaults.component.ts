import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface VaultInfo {
  name: string;
  symbol: string;
  iconUrl: string;
  annualPercentageYield: string;
  totalValueLocked: string;
  availableAmount: string;
  depositedAmount: string;
  coinType?: string;
  description?: string;
}

@Component({
  selector: 'view-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
})
export class VaultsComponent implements OnInit {
  vaults: VaultInfo[];

  constructor(private router: Router) {
    this.vaults = [
      {
        name: 'Cosmos',
        symbol: 'atom',
        iconUrl:
          'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg',

        annualPercentageYield: '0.03',
        totalValueLocked: '100000',
        availableAmount: '20000',
        depositedAmount: '0',
      },
      {
        name: 'Osmosis',
        symbol: 'osmo',
        iconUrl:
          'https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png',

        annualPercentageYield: '0.05',
        totalValueLocked: '60000',
        availableAmount: '20000',
        depositedAmount: '0',
      },
    ];
  }

  ngOnInit(): void {}

  navigate(path: string) {
    this.router.navigate(['path']);
  }
}
