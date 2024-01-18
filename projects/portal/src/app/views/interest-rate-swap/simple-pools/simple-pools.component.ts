import { IRSVaultImage } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-simple-pools',
  templateUrl: './simple-pools.component.html',
  styleUrls: ['./simple-pools.component.css'],
})
export class SimplePoolsComponent implements OnInit {
  @Input()
  tranchePools?: AllTranches200ResponseTranchesInner[] | null;
  @Input()
  vaults?: VaultByContract200ResponseVault[] | null;
  @Input()
  extendedVaults?: (VaultByContract200ResponseVault & { denom?: string; maxAPY: number })[] | null;
  @Input()
  vaultsImages?: IRSVaultImage[] | null;

  sortType?: string;
  viewMode?: 'table' | 'grid' = 'table';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'pools']);
  }

  getVaultImage(contract?: string): IRSVaultImage | undefined {
    return this.vaultsImages?.find((vault) => vault.contract === contract);
  }
}
