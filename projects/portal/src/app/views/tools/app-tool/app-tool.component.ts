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
      { name: 'Utilities', link: '/', icon: 'account_balance_wallet' },
      { name: 'NFT Backed Loan', link: '/nft-backed-loan', icon: 'photo_library' },
      { name: 'Derivatives', link: '/derivatives/perpetual-futures', icon: 'show_chart' },
    ];
  }

  ngOnInit(): void {}
}
