import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { IRSVaultImage } from 'projects/portal/src/app/models/config.service';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { ReadableEstimationInfo } from 'projects/portal/src/app/pages/interest-rate-swap/vaults/vault/vault.component';
import {
  AllTranches200ResponseTranchesInner,
  EstimateMintLiquidityPoolToken200Response,
  TranchePoolAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-simple-pool',
  templateUrl: './simple-pool.component.html',
  styleUrls: ['./simple-pool.component.css'],
})
export class SimplePoolComponent implements OnInit {
  @Input()
  address?: string | null;
  @Input()
  contractAddress?: string | null;
  @Input()
  pools?: AllTranches200ResponseTranchesInner[] | null;
  @Input()
  vault?: VaultByContract200ResponseVault | null;
  @Input()
  poolAPYs?: TranchePoolAPYs200Response[] | null;
  @Input()
  denomBalancesMap?: { [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin } | null;
  @Input()
  vaultImage?: IRSVaultImage | null;
  @Input()
  estimatedRequiredAmountForMint$?: EstimateMintLiquidityPoolToken200Response | null;
  @Input()
  estimatedRedeemAmount$?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  tab: 'deposit' | 'withdraw' = 'deposit';
  selectedPoolId?: string;
  inputUnderlying?: string;
  inputLP?: string;

  @Output()
  appMintLP: EventEmitter<MintLpRequest> = new EventEmitter<MintLpRequest>();
  @Output()
  appChangeMintLP: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appRedeemLP: EventEmitter<RedeemLpRequest> = new EventEmitter<RedeemLpRequest>();
  @Output()
  appChangeRedeemLP: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'pools', this.contractAddress]);
  }

  onDepositPool() {
    alert('Not Supported Yet');
  }

  onWithdrawPool() {
    if (!this.inputLP) {
      alert('Please input the LP amount.');
      return;
    }
    if (!this.selectedPoolId) {
      alert('Please select the maturity.');
      return;
    }
    this.appRedeemLP.emit({
      trancheId: this.selectedPoolId,
      lpReadableAmount: Number(this.inputLP),
      lpDenom: `irs/tranche/${this.selectedPoolId}/ls`,
    });
  }

  onChangeDeposit() {
    if (this.selectedPoolId && this.inputLP) {
      this.appChangeMintLP.emit({
        poolId: this.selectedPoolId,
        denom: `irs/tranche/${this.selectedPoolId}/ls`,
        readableAmount: Number(this.inputLP),
      });
    }
  }

  onChangeWithdraw() {
    if (this.selectedPoolId && this.inputLP) {
      this.appChangeRedeemLP.emit({
        poolId: this.selectedPoolId,
        denom: `irs/tranche/${this.selectedPoolId}/ls`,
        readableAmount: Number(this.inputLP),
      });
    }
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
