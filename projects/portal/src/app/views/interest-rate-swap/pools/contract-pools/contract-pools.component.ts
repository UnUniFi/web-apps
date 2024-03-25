import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IRSVaultImage } from 'projects/portal/src/app/models/config.service';
import {
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-contract-pools',
  templateUrl: './contract-pools.component.html',
  styleUrls: ['./contract-pools.component.css'],
})
export class ContractPoolsComponent implements OnInit {
  @Input()
  contractAddress?: string | null;
  @Input()
  tranchePools?: AllTranches200ResponseTranchesInner[] | null;
  @Input()
  vault?: VaultByContract200ResponseVault | null;
  @Input()
  poolsAPYs?: (TranchePoolAPYs200Response | undefined)[] | null;
  @Input()
  vaultImage?: IRSVaultImage | null;

  sortType?: string;
  viewMode?: string = 'table';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-pools', this.contractAddress]);
  }
}
