import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { AllTranches200ResponseTranchesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  @Input()
  poolId?: string | null;
  @Input()
  lsDenom?: string | null;
  @Input()
  ptDenom?: string | null;
  @Input()
  tranchePool?: AllTranches200ResponseTranchesInner | null;
  @Input()
  mintLsAmount?: number | null;
  @Input()
  redeemLsAmount?: number | null;
  @Input()
  estimateMintRequiredAmount?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;
  @Input()
  estimateRedeemAmount?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  inputUnderlying?: string;
  inputPT?: string;
  underlyingDenom? = 'uatom';

  description = 'This Vault provides the fixed yield of stATOM.';
  tab: 'mint' | 'redeem' = 'mint';
  modeTab: 'mint' | 'redeem' = 'mint';

  @Output()
  appChangeMintAmount: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  appChangeRedeemAmount: EventEmitter<number> = new EventEmitter<number>();
  @Output()
  appMintLP: EventEmitter<MintLpRequest> = new EventEmitter<MintLpRequest>();
  @Output()
  appRedeemLP: EventEmitter<RedeemLpRequest> = new EventEmitter<RedeemLpRequest>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-pools', this.poolId]);
  }

  onMintLP(id: string) {
    if (!this.lsDenom) {
      alert('Invalid LP token.');
      return;
    }
    if (!this.mintLsAmount) {
      alert('Please input the token amount.');
      return;
    }
    let readableAmountMapInMax: { [denom: string]: number } = {};
    if (this.inputUnderlying) {
      if (!this.underlyingDenom) {
        alert('Please select the token.');
        return;
      }
      readableAmountMapInMax[this.underlyingDenom] = Number(this.inputUnderlying);
    }
    if (this.ptDenom && this.inputPT) {
      readableAmountMapInMax[this.ptDenom] = Number(this.inputPT);
    }
    this.appMintLP.emit({
      trancheId: id,
      lpReadableAmount: this.mintLsAmount,
      lpDenom: this.lsDenom,
      readableAmountMapInMax,
    });
  }

  onRedeemLP(id: string) {
    if (!this.lsDenom) {
      alert('Invalid LP token.');
      return;
    }
    if (!this.redeemLsAmount) {
      alert('Please input the LP token amount.');
      return;
    }
    this.appRedeemLP.emit({
      trancheId: id,
      lpReadableAmount: this.redeemLsAmount,
      lpDenom: this.lsDenom,
    });
  }
}
