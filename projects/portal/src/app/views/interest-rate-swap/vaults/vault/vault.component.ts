import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import {
  MintPtRequest,
  MintPtYtRequest,
  MintYtRequest,
  RedeemPtRequest,
  RedeemPtYtRequest,
  RedeemYtRequest,
} from 'projects/portal/src/app/models/irs/irs.model';
import { ReadableEstimationInfo } from 'projects/portal/src/app/pages/interest-rate-swap/vaults/vault/vault.component';
import {
  AllTranches200ResponseTranchesInner,
  EstimateMintPtYtPair200Response,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
  VaultByContract200ResponseVault,
  VaultDetails200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  @Input()
  contractAddress?: string | null;
  @Input()
  vault?: VaultByContract200ResponseVault | null;
  @Input()
  trancheId?: string | null;
  @Input()
  tranchePool?: AllTranches200ResponseTranchesInner | null;
  @Input()
  underlyingDenom?: string | null;
  @Input()
  trancheYtAPYs?: TrancheYtAPYs200Response | null;
  @Input()
  tranchePtAPYs?: TranchePtAPYs200Response | null;
  @Input()
  vaultDetails?: (VaultDetails200Response | undefined)[] | null;
  @Input()
  estimateMintPt?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  estimateRedeemPt?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  estimateMintPtYt?: EstimateMintPtYtPair200Response | null;
  @Input()
  estimatePtRedeemPtYt?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  estimateRequiredUtMintYt?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;
  @Input()
  estimateRedeemMaturedYt?: cosmosclient.proto.cosmos.base.v1beta1.ICoin | null;

  inputUnderlying?: string;
  inputIrsToken?: string;
  inputYT?: string;
  inputPT?: string;
  inputDesiredUnderlying?: string;
  inputDesiredYT?: string;

  modeTab: 'swap' | 'mint' = 'swap';
  swapTab: 'pt' | 'yt' = 'pt';
  txTab: 'all' | 'swap' | 'liquidity' = 'all';
  txMode: 'mint' | 'redeem' = 'mint';

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
  @Output()
  appMintPTYT: EventEmitter<MintPtYtRequest> = new EventEmitter<MintPtYtRequest>();
  @Output()
  appChangeMintPTYT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appRedeemPTYT: EventEmitter<RedeemPtYtRequest> = new EventEmitter<RedeemPtYtRequest>();
  @Output()
  appChangeRedeemPTYT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appMintYT: EventEmitter<MintYtRequest> = new EventEmitter<MintYtRequest>();
  @Output()
  appChangeMintYT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appRedeemYT: EventEmitter<RedeemYtRequest> = new EventEmitter<RedeemYtRequest>();
  @Output()
  appChangeRedeemYT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-vaults', this.contractAddress]);
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

  onSubmitSwapMint() {
    if (!this.trancheId) {
      alert('Invalid tranche ID.');
      return;
    }
    if (!this.inputUnderlying) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    if (this.swapTab === 'pt') {
      this.appMintPT.emit({
        trancheId: this.trancheId,
        trancheType: 1,
        utDenom: this.underlyingDenom,
        readableAmount: Number(this.inputUnderlying),
      });
    }
    if (this.swapTab === 'yt') {
      this.appMintYT.emit({
        trancheId: this.trancheId,
        trancheType: 2,
        utDenom: this.underlyingDenom,
        readableAmount: Number(this.inputUnderlying),
        requiredYT: Number(this.inputDesiredYT),
      });
    }
  }

  onSubmitSwapRedeem() {
    if (!this.trancheId) {
      alert('Invalid tranche ID.');
      return;
    }
    if (this.swapTab === 'pt') {
      if (!this.inputPT) {
        alert('Please input the PT token amount.');
        return;
      }
      this.appRedeemPT.emit({
        trancheId: this.trancheId,
        trancheType: 1,
        ptDenom: `irs/tranche/${this.trancheId}/pt`,
        readableAmount: Number(this.inputPT),
      });
    }
    if (this.swapTab === 'yt') {
      if (!this.inputYT) {
        alert('Please input the YT token amount.');
        return;
      }
      if (!this.underlyingDenom) {
        alert('Invalid token to redeem.');
        return;
      }
      this.appRedeemYT.emit({
        trancheId: this.trancheId,
        trancheType: 2,
        ytDenom: `irs/tranche/${this.trancheId}/yt`,
        readableAmount: Number(this.inputYT),
        utDenom: this.underlyingDenom,
        requiredUT: Number(this.inputDesiredUnderlying),
      });
    }
  }

  onSubmitMintMint() {
    if (!this.trancheId) {
      alert('Invalid tranche ID.');
      return;
    }
    if (!this.inputUnderlying) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    this.appMintPTYT.emit({
      trancheId: this.trancheId,
      trancheType: 0,
      utDenom: this.underlyingDenom,
      readableAmount: Number(this.inputUnderlying),
    });
  }

  onSubmitMintRedeem() {
    if (!this.trancheId) {
      alert('Invalid tranche ID.');
      return;
    }
    if (!this.inputPT) {
      alert('Please input the PT token amount.');
      return;
    }
    if (!this.inputYT) {
      alert('Please input the YT token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    if (!this.inputDesiredUnderlying) {
      alert('Unable to redeem YT.');
      return;
    }
    this.appRedeemPTYT.emit({
      trancheId: this.trancheId,
      trancheType: 0,
      readableAmountMap: {
        [`irs/tranche/${this.trancheId}/pt`]: Number(this.inputPT),
        [`irs/tranche/${this.trancheId}/yt`]: Number(this.inputYT),
      },
      utDenom: this.underlyingDenom,
      requiredUT: Number(this.inputDesiredUnderlying),
    });
  }

  onChangeSwapUnderlyingAmount() {
    if (this.swapTab === 'pt' && this.trancheId && this.underlyingDenom && this.inputUnderlying) {
      this.appChangeMintPT.emit({
        poolId: this.trancheId,
        denom: this.underlyingDenom,
        readableAmount: Number(this.inputUnderlying),
      });
    }
  }

  onChangeSwapRequiredYt() {
    if (this.swapTab === 'yt' && this.trancheId && this.underlyingDenom && this.inputUnderlying) {
      this.appChangeMintYT.emit({
        poolId: this.trancheId,
        denom: `irs/tranche/${this.trancheId}/yt`,
        readableAmount: Number(this.inputDesiredYT),
      });
    }
  }

  onChangeSwapPtAmount() {
    if (this.swapTab === 'pt' && this.trancheId && this.underlyingDenom && this.inputPT) {
      this.appChangeRedeemPT.emit({
        poolId: this.trancheId,
        denom: `irs/tranche/${this.trancheId}/pt`,
        readableAmount: Number(this.inputPT),
      });
    }
  }

  onChangeSwapYtAmount() {
    if (this.swapTab === 'yt' && this.trancheId && this.underlyingDenom && this.inputYT) {
      this.appChangeRedeemYT.emit({
        poolId: this.trancheId,
        denom: `irs/tranche/${this.trancheId}/yt`,
        readableAmount: Number(this.inputYT),
      });
    }
  }

  onChangeMintUnderlyingAmount() {
    if (this.trancheId && this.underlyingDenom && this.inputUnderlying) {
      this.appChangeMintPTYT.emit({
        poolId: this.trancheId,
        denom: this.underlyingDenom,
        readableAmount: Number(this.inputUnderlying),
      });
    }
  }

  onChangeRedeemMintUnderlyingAmount() {
    if (this.trancheId && this.underlyingDenom && this.inputDesiredUnderlying) {
      this.appChangeRedeemPTYT.emit({
        poolId: this.trancheId,
        denom: this.underlyingDenom,
        readableAmount: Number(this.inputDesiredUnderlying),
      });
    }
  }
}
