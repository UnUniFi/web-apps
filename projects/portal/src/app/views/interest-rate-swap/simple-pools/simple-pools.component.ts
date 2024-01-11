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
  poolsAPYs?: (TranchePoolAPYs200Response | undefined)[] | null;
  sortType?: string;
  viewMode?: 'table' | 'grid' = 'table';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'pools']);
  }

  getTranchePoolVault(contractAddr?: string): VaultByContract200ResponseVault | undefined {
    const vault = this.vaults?.find((vault) => vault.strategy_contract === contractAddr);
    return vault;
  }
}
