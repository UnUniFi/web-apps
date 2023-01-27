import { VaultInfo } from '../vaults.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  vault: VaultInfo;

  constructor() {
    this.vault = {
      name: 'Cosmos',
      symbol: 'atom',
      iconUrl:
        'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/atom.svg',
      annualPercentageYield: '0.03',
      totalValueLocked: '100000',
      availableAmount: '20000',
      depositedAmount: '0',
      coinType: 'cosmos',
      description:
        'Cosmos (ATOM) is a cryptocurrency that powers an ecosystem of blockchains designed to scale and interoperate with each other. The team aims to "create an Internet of Blockchains, a network of blockchains able to communicate with each other in a decentralized way." Cosmos is a proof-of-stake chain. ATOM holders can stake their tokens in order to maintain the network and receive more ATOM as a reward.',
    };
  }

  ngOnInit(): void {}
}
