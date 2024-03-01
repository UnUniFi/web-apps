import { IRSVaultImage } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
  TrancheYtAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-pools',
  templateUrl: './pools.component.html',
  styleUrls: ['./pools.component.css'],
})
export class PoolsComponent implements OnInit {
  @Input()
  tranchePools?: AllTranches200ResponseTranchesInner[] | null;
  @Input()
  vaults?: VaultByContract200ResponseVault[] | null;
  @Input()
  poolsAPYs?: (TranchePoolAPYs200Response | undefined)[] | null;
  @Input()
  poolsYtAPYs?: (TrancheYtAPYs200Response | undefined)[] | null;
  @Input()
  vaultsImages?: IRSVaultImage[] | null;
  @Input()
  totalLiquiditiesUSD?: number[] | null;

  sortType?: string;
  viewMode?: 'table' | 'grid' = 'table';

  constructor(private router: Router) {}

  ngOnInit(): void {
    const width = window.innerWidth;
    if (width <= 640) {
      this.viewMode = 'grid';
    }
  }

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-pools']);
  }

  getTranchePoolVault(contractAddr?: string): VaultByContract200ResponseVault | undefined {
    const vault = this.vaults?.find((vault) => vault.strategy_contract === contractAddr);
    return vault;
  }

  getVaultImage(contract?: string): IRSVaultImage | undefined {
    return this.vaultsImages?.find((vault) => vault.contract === contract);
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

  calcTotalPoolAPY(
    poolApy: TranchePoolAPYs200Response | null | undefined,
    ytApy: TrancheYtAPYs200Response | null | undefined,
  ): number {
    let apy = 0;
    if (poolApy) {
      apy += Number(poolApy.liquidity_apy) + Number(poolApy.discount_pt_apy);
      if (ytApy) {
        apy += Number(ytApy.ls_apy) * Number(poolApy.pt_percentage_in_pool);
      }
    }
    return apy;
  }
}
