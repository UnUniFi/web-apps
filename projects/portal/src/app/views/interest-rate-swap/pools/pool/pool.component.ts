import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SwapRequest } from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.model';

@Component({
  selector: 'view-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  inputUnderlying?: string;
  inputLP?: string;
  underlyingDenom? = 'uatom';
  lpDenom = 'lp/';

  description = 'This Vault provides the fixed yield of stATOM.';
  tab: 'deposit' | 'withdraw' = 'deposit';

  @Output()
  appMintLP: EventEmitter<SwapRequest> = new EventEmitter<SwapRequest>();
  @Output()
  appRedeemLP: EventEmitter<SwapRequest> = new EventEmitter<SwapRequest>();

  constructor() {}

  ngOnInit(): void {}

  onMintLP() {
    if (!this.inputUnderlying) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    this.appMintLP.emit({
      readableAmount: this.inputUnderlying,
      denom: this.underlyingDenom,
    });
  }

  onRedeemLP() {
    if (!this.inputLP) {
      alert('Please input the LP token amount.');
      return;
    }
    this.appRedeemLP.emit({
      readableAmount: this.inputLP,
      denom: this.lpDenom,
    });
  }
}
