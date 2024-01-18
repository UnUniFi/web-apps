import { IRSVaultImage } from '../../../models/config.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
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
  vaultsImages?: IRSVaultImage[] | null;

  sortType?: string;
  viewMode?: string = 'table';

  constructor(private router: Router) {}

  ngOnInit(): void {}

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
}
