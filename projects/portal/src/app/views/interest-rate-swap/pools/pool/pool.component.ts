import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';

@Component({
  selector: 'view-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  inputUnderlying?: string;
  inputPT?: string;
  inputLP?: string;
  underlyingDenom? = 'uatom';
  lpDenom = 'lp/';
  ptDenom = 'pt/';

  description = 'This Vault provides the fixed yield of stATOM.';
  tab: 'deposit' | 'withdraw' = 'deposit';

  @Output()
  appMintLP: EventEmitter<MintLpRequest> = new EventEmitter<MintLpRequest>();
  @Output()
  appRedeemLP: EventEmitter<RedeemLpRequest> = new EventEmitter<RedeemLpRequest>();

  constructor() {}

  ngOnInit(): void {}

  onMintLP(id: string) {
    if (!this.inputUnderlying && !this.inputLP) {
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
    if (this.inputPT) {
      readableAmountMapInMax[this.ptDenom] = Number(this.inputPT);
    }
    if (!this.inputLP) {
      alert('Please input the LP token amount.');
      return;
    }
    this.appMintLP.emit({
      trancheId: id,
      lpReadableAmount: Number(this.inputLP),
      lpDenom: this.lpDenom,
      readableAmountMapInMax,
    });
  }

  onRedeemLP(id: string) {
    if (!this.inputLP) {
      alert('Please input the LP token amount.');
      return;
    }
    this.appRedeemLP.emit({
      trancheId: id,
      lpReadableAmount: Number(this.inputLP),
      lpDenom: this.lpDenom,
    });
  }
}
