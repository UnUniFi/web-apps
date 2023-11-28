import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  RedeemUnderlyingRequest,
  SwapRequest,
} from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.model';

@Component({
  selector: 'view-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  inputUnderlying?: string;
  inputYT?: string;
  inputPT?: string;
  underlyingDenom? = 'uatom';
  ytDenom = 'yt/';
  ptDenom = 'pt/';

  description = 'This Vault provides the fixed yield of stATOM.';
  yield: 'long' | 'variable' | 'fixed' = 'fixed';
  tab: 'deposit' | 'withdraw' = 'deposit';

  @Output()
  appMintYT: EventEmitter<SwapRequest> = new EventEmitter<SwapRequest>();
  @Output()
  appRedeemYT: EventEmitter<SwapRequest> = new EventEmitter<SwapRequest>();
  @Output()
  appMintPT: EventEmitter<SwapRequest> = new EventEmitter<SwapRequest>();
  @Output()
  appRedeemPT: EventEmitter<SwapRequest> = new EventEmitter<SwapRequest>();
  @Output()
  appMintPTYT: EventEmitter<SwapRequest> = new EventEmitter<SwapRequest>();
  @Output()
  appRedeemPTYT: EventEmitter<RedeemUnderlyingRequest> =
    new EventEmitter<RedeemUnderlyingRequest>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-vaults', '1']);
  }

  onMintYT() {
    if (!this.inputUnderlying) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    this.appMintYT.emit({
      readableAmount: this.inputUnderlying,
      denom: this.underlyingDenom,
    });
  }

  onRedeemYT() {
    if (!this.inputYT) {
      alert('Please input the YT token amount.');
      return;
    }
    this.appRedeemYT.emit({
      readableAmount: this.inputYT,
      denom: this.ytDenom,
    });
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
    this.appMintPT.emit({
      readableAmount: this.inputUnderlying,
      denom: this.underlyingDenom,
    });
  }

  onRedeemPT() {
    if (!this.inputPT) {
      alert('Please input the PT token amount.');
      return;
    }
    this.appRedeemPT.emit({
      readableAmount: this.inputPT,
      denom: this.ptDenom,
    });
  }

  onMintPTYT() {
    if (!this.inputUnderlying) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.underlyingDenom) {
      alert('Please select the token.');
      return;
    }
    this.appMintPTYT.emit({
      readableAmount: this.inputUnderlying,
      denom: this.underlyingDenom,
    });
  }

  onRedeemPTYT() {
    if (!this.inputPT) {
      alert('Please input the PT token amount.');
      return;
    }
    if (!this.inputYT) {
      alert('Please input the YT token amount.');
      return;
    }
    this.appRedeemPTYT.emit({
      ptReadableAmount: this.inputPT,
      ptDenom: this.ptDenom,
      ytReadableAmount: this.inputYT,
      ytDenom: this.ytDenom,
    });
  }
}
