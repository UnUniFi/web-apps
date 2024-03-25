import { IRSVaultImage } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-rewards',
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.css'],
})
export class RewardsComponent implements OnInit {
  @Input()
  maturedPtPositions?:
    | {
        id: string | undefined;
        name: string | undefined;
        tranche: AllTranches200ResponseTranchesInner | undefined;
        apy: TranchePtAPYs200Response | undefined;
        positionAmount: number;
        positionValue: number;
      }[]
    | null;
  @Input()
  vaultsImages?: IRSVaultImage[] | null;
  @Input()
  maturedPtValue?: number | null;

  sortType?: string;
  positionTab?: 'fixed' | 'long' | 'liquidity' = 'fixed';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'vaults']);
  }

  calcMaturity(pool?: AllTranches200ResponseTranchesInner): number {
    if (!pool) {
      return 0;
    }
    const maturity = Number(pool.maturity) + Number(pool.start_time);
    return maturity * 1000;
  }

  calcRestDays(pool?: AllTranches200ResponseTranchesInner): number {
    if (!pool) {
      return 0;
    }
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

  getVaultImage(contract?: string): IRSVaultImage | undefined {
    return this.vaultsImages?.find((vault) => vault.contract === contract);
  }
}
