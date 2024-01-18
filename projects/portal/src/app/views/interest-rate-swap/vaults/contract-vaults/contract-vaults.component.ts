import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRSVaultImage } from 'projects/portal/src/app/models/config.service';
import {
  AllTranches200ResponseTranchesInner,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-contract-vaults',
  templateUrl: './contract-vaults.component.html',
  styleUrls: ['./contract-vaults.component.css'],
})
export class ContractVaultsComponent implements OnInit {
  @Input()
  contractAddress?: string | null;
  @Input()
  vault?: VaultByContract200ResponseVault | null;
  @Input()
  tranchePools?: AllTranches200ResponseTranchesInner[] | null;
  @Input()
  trancheFixedAPYs?: (TranchePtAPYs200Response | undefined)[] | null;
  @Input()
  trancheLongAPYs?: (TrancheYtAPYs200Response | undefined)[] | null;
  @Input()
  vaultImage?: IRSVaultImage | null;

  sortType?: string;
  viewMode?: 'table' | 'grid' = 'grid';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-vaults', this.contractAddress]);
  }

  calcMaturity(pool: AllTranches200ResponseTranchesInner): number {
    const maturity = Number(pool.maturity) + Number(pool.start_time);
    return maturity * 1000;
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
}
