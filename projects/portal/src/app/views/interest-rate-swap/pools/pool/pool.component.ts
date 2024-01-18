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
  selector: 'view-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  @Input()
  contractAddress?: string | null;
  @Input()
  poolId?: string | null;
  @Input()
  pool?: AllTranches200ResponseTranchesInner | null;
  @Input()
  vault?: VaultByContract200ResponseVault | null;
  @Input()
  poolAPYs?: TranchePoolAPYs200Response | null;
  @Input()
  underlyingDenom?: string | null;
  @Input()
  poolBalance?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  vaultImage?: IRSVaultImage | null;
  @Input()
  estimatedMintAmount?: EstimateMintLiquidityPoolToken200Response | null;
  @Input()
  estimatedRedeemAmount?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  tab: 'deposit' | 'withdraw' = 'deposit';
  inputUnderlying?: string;
  inputUT?: string;
  inputPT?: string;
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

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-pools', this.contractAddress]);
  }

  onDepositPool() {
    alert('Not Supported Yet');
  }

  onWithdrawPool() {
    if (!this.inputLP) {
      alert('Please input the LP amount.');
      return;
    }
    if (!this.poolId) {
      alert('Please select the maturity.');
      return;
    }
    this.appRedeemLP.emit({
      trancheId: this.poolId,
      lpReadableAmount: Number(this.inputLP),
      lpDenom: `irs/tranche/${this.poolId}/ls`,
    });
  }

  onChangeDepositUt() {
    if (this.poolId && this.inputUT && this.underlyingDenom) {
      this.appChangeMintLP.emit({
        poolId: this.poolId,
        denom: this.underlyingDenom,
        readableAmount: Number(this.inputUT),
      });
    }
  }

  onChangeDepositPt() {
    if (this.poolId && this.inputUT) {
      this.appChangeMintLP.emit({
        poolId: this.poolId,
        denom: `irs/tranche/${this.poolId}/pt`,
        readableAmount: Number(this.inputPT),
      });
    }
  }

  onChangeWithdraw() {
    if (this.poolId && this.inputLP) {
      this.appChangeRedeemLP.emit({
        poolId: this.poolId,
        denom: `irs/tranche/${this.poolId}/ls`,
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
