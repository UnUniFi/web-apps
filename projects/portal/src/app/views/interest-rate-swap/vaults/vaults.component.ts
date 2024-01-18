import { IRSVaultImage } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AllTranches200ResponseTranchesInner,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
})
export class VaultsComponent implements OnInit {
  @Input()
  vaults?: VaultByContract200ResponseVault[] | null;
  @Input()
  tranchePools?: AllTranches200ResponseTranchesInner[] | null;
  @Input()
  trancheFixedAPYs?: (TranchePtAPYs200Response | undefined)[] | null;
  @Input()
  trancheLongAPYs?: (TrancheYtAPYs200Response | undefined)[] | null;
  @Input()
  vaultsImages?: IRSVaultImage[] | null;

  sortType?: string;
  viewMode?: 'table' | 'grid' = 'table';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-vaults']);
  }

  getTranchePoolVault(contractAddr?: string): VaultByContract200ResponseVault | undefined {
    const vault = this.vaults?.find((vault) => vault.strategy_contract === contractAddr);
    return vault;
  }

  calcMaturity(pool: AllTranches200ResponseTranchesInner): number {
    const maturity = Number(pool.maturity) + Number(pool.start_time);
    return maturity;
  }

  calcRestDays(pool: AllTranches200ResponseTranchesInner): number {
    const maturity = Number(pool.maturity) + Number(pool.start_time);
    const diff = maturity * 1000 - Date.now();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    return days;
  }

  getVaultImage(contract?: string): IRSVaultImage | undefined {
    return this.vaultsImages?.find((vault) => vault.contract === contract);
  }
}
