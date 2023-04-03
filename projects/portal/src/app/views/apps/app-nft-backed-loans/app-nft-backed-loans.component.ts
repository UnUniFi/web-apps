import { apps } from '../../tools/app-tool/app-tool.component';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'view-app-nft-backed-loans',
  templateUrl: './app-nft-backed-loans.component.html',
  styleUrls: ['./app-nft-backed-loans.component.css'],
})
export class AppNftBackedLoansComponent implements OnInit {
  @Input()
  navigations?: { name: string; link: string; icon: string }[] | null;

  apps: { name: string; link: string; icon: string }[];

  constructor() {
    this.apps = apps;
  }

  ngOnInit(): void {}
}
