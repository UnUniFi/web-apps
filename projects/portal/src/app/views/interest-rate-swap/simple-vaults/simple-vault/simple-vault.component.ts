import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { MintPtRequest, RedeemPtRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { ReadableEstimationInfo } from 'projects/portal/src/app/pages/interest-rate-swap/vaults/vault/vault.component';
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
  @Input()
  estimateMintPt?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  estimateRedeemPt?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;

  selectedPoolId?: string;
  inputUnderlying?: string;
  inputPT?: string;

  @Output()
  appMintPT: EventEmitter<MintPtRequest> = new EventEmitter<MintPtRequest>();
  @Output()
  appChangeMintPT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appRedeemPT: EventEmitter<RedeemPtRequest> = new EventEmitter<RedeemPtRequest>();
  @Output()
  appChangeRedeemPT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();

  description = 'This Vault provides the fixed yield of stATOM.';
  tab: 'deposit' | 'withdraw' = 'deposit';

  constructor(private router: Router) {}

  ngOnInit(): void {}

  selectTranche(tranche: AllTranches200ResponseTranchesInner) {
    this.selectedPoolId = tranche.id;
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

  onMintPT() {
    if (!this.inputUnderlying) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    if (!this.selectedPoolId) {
      alert('Please select the maturity.');
      return;
    }
    this.appMintPT.emit({
      trancheId: this.selectedPoolId,
      trancheType: 1,
      utDenom: this.underlyingDenom,
      readableAmount: Number(this.inputUnderlying),
    });
  }

  onRedeemPT() {
    if (!this.inputPT) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.selectedPoolId) {
      alert('Please select the maturity.');
      return;
    }
    this.appRedeemPT.emit({
      trancheId: this.selectedPoolId,
      trancheType: 1,
      ptDenom: `irs/tranche/${this.selectedPoolId}/pt`,
      readableAmount: Number(this.inputPT),
    });
  }

  onChangeDeposit() {
    if (this.selectedPoolId && this.underlyingDenom && this.inputUnderlying) {
      this.appChangeMintPT.emit({
        poolId: this.selectedPoolId,
        denom: this.underlyingDenom,
        readableAmount: Number(this.inputUnderlying),
      });
    }
  }
  onChangeWithdraw() {
    if (this.selectedPoolId && this.inputPT) {
      this.appChangeRedeemPT.emit({
        poolId: this.selectedPoolId,
        denom: `irs/tranche/${this.selectedPoolId}/pt`,
        readableAmount: Number(this.inputPT),
      });
    }
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
