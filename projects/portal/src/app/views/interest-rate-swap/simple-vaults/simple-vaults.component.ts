import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VaultByContract200ResponseVault } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-simple-vaults',
  templateUrl: './simple-vaults.component.html',
  styleUrls: ['./simple-vaults.component.css'],
})
export class SimpleVaultsComponent implements OnInit {
  @Input()
  vaults?: VaultByContract200ResponseVault[] | null;

  sortType?: string;
  viewMode?: 'table' | 'grid' = 'grid';
  positionTab?: 'fixed' | 'liquidity' = 'fixed';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'vaults']);
  }
}
