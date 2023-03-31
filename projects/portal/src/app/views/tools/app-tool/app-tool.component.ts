import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-tool',
  templateUrl: './app-tool.component.html',
  styleUrls: ['./app-tool.component.css'],
})
export class AppToolComponent implements OnInit {
  apps: { name: string; link: string; icon: string }[];

  constructor() {
    this.apps = [
      { name: 'Utilities', link: '/', icon: 'assistant' },
      // { name: 'NFT Backed Loan', link: '/nft-backed-loan', icon: 'loyalty' },
      // { name: 'Derivatives', link: '/derivatives/perpetual-futures', icon: 'show_chart' },
      { name: 'Yield Aggregator', link: '/yield-aggregator/vaults', icon: 'pie_chart' },
    ];
  }

  ngOnInit(): void {}
}
