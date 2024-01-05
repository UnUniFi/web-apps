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
  inputYT?: string;
  inputPT?: string;
  ytDenom = 'yt/';
  ptDenom = 'pt/';
  requiredYT?: string;
  requiredUT?: string;

  description = 'This Vault provides the fixed yield of stATOM.';
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

  onMintPTYT(id: string) {
    if (!this.inputUnderlying) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    this.appMintPTYT.emit({
      trancheId: id,
      trancheType: 0,
      utDenom: this.underlyingDenom,
      readableAmount: Number(this.inputUnderlying),
    });
  }

  onRedeemPTYT(id: string) {
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
    if (!this.requiredUT) {
      alert('Unable to redeem YT.');
      return;
    }
    this.appRedeemPTYT.emit({
      trancheId: id,
      trancheType: 0,
      readableAmountMap: {
        [this.ptDenom]: Number(this.inputPT),
        [this.ytDenom]: Number(this.inputYT),
      },
      utDenom: this.underlyingDenom,
      requiredUT: Number(this.requiredUT),
    });
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

  onRedeemPT(id: string) {
    if (!this.inputPT) {
      alert('Please input the PT token amount.');
      return;
    }
    this.appRedeemPT.emit({
      trancheId: id,
      trancheType: 1,
      ptDenom: this.ptDenom,
      readableAmount: Number(this.inputPT),
    });
  }

  onMintYT(id: string) {
    if (!this.inputUnderlying) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    if (!this.requiredYT) {
      alert('Unable to mint YT.');
      return;
    }
    this.appMintYT.emit({
      trancheId: id,
      trancheType: 2,
      utDenom: this.underlyingDenom,
      readableAmount: Number(this.inputUnderlying),
      requiredYT: Number(this.requiredYT),
    });
  }

  onRedeemYT(id: string) {
    if (!this.inputYT) {
      alert('Please input the YT token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    if (!this.requiredUT) {
      alert('Unable to redeem YT.');
      return;
    }
    this.appRedeemYT.emit({
      trancheId: id,
      trancheType: 2,
      ytDenom: this.ytDenom,
      readableAmount: Number(this.inputYT),
      utDenom: this.underlyingDenom,
      requiredUT: Number(this.requiredUT),
    });
  }
}
