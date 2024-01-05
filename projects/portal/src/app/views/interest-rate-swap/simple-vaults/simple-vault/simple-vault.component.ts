import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { MintPtRequest } from 'projects/portal/src/app/models/irs/irs.model';
import {
  AllTranches200ResponseTranchesInner,
  TranchePtAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-simple-vault',
  templateUrl: './simple-vault.component.html',
  styleUrls: ['./simple-vault.component.css'],
})
export class SimpleVaultComponent implements OnInit {
  @Input()
  vault?: VaultByContract200ResponseVault | null;
  @Input()
  tranches?: AllTranches200ResponseTranchesInner[] | null;
  @Input()
  trancheFixedAPYs?: (TranchePtAPYs200Response | undefined)[] | null;
  @Input()
  underlyingDenom?: string | null;
  @Input()
  vaultBalances?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  selectedTranche?: AllTranches200ResponseTranchesInner;
  inputUnderlying?: string;

  @Output()
  appMintPT: EventEmitter<MintPtRequest> = new EventEmitter<MintPtRequest>();

  description = 'This Vault provides the fixed yield of stATOM.';
  tab: 'deposit' | 'withdraw' = 'deposit';
  selectedMaturity?: string;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  selectTranche(tranche: AllTranches200ResponseTranchesInner) {
    this.selectedTranche = tranche;
    if (tranche.pool_assets) {
      for (const asset of tranche.pool_assets) {
        if (!asset.denom?.includes('irs/tranche/')) {
          this.underlyingDenom = asset.denom;
        }
      }
    }
  }

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'vaults', '1']);
  }

  onMintPT(id: string) {
    if (!this.inputUnderlying) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    this.appMintPT.emit({
      trancheId: id,
      trancheType: 1,
      utDenom: this.underlyingDenom,
      readableAmount: Number(this.inputUnderlying),
    });
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
}
