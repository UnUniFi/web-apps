import { IRSVaultImage } from '../../../models/config.service';
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
  @Input()
  vaultsMaxFixedAPYs?: number[] | null;
  @Input()
  vaultsImages?: IRSVaultImage[] | null;

  sortType?: string;
  viewMode?: 'table' | 'grid' = 'grid';
  positionTab?: 'fixed' | 'liquidity' = 'fixed';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const top = document.getElementById('page-top');
    if (top)
      top.scrollIntoView({
        block: 'start',
      });
  }

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'vaults']);
  }

  getVaultImage(contract?: string): IRSVaultImage | undefined {
    return this.vaultsImages?.find((vault) => vault.contract === contract);
  }
}
