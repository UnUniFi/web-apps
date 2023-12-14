import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  MintPtRequest,
  MintPtYtRequest,
  MintYtRequest,
  RedeemPtRequest,
  RedeemPtYtRequest,
  RedeemYtRequest,
} from 'projects/portal/src/app/models/irs/irs.model';

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
  requiredYT?: string;
  requiredUT?: string;

  description = 'This Vault provides the fixed yield of stATOM.';
  yield: 'long' | 'variable' | 'fixed' = 'fixed';
  tab: 'deposit' | 'withdraw' = 'deposit';

  @Output()
  appMintYT: EventEmitter<MintYtRequest> = new EventEmitter<MintYtRequest>();
  @Output()
  appRedeemYT: EventEmitter<RedeemYtRequest> = new EventEmitter<RedeemYtRequest>();
  @Output()
  appMintPT: EventEmitter<MintPtRequest> = new EventEmitter<MintPtRequest>();
  @Output()
  appRedeemPT: EventEmitter<RedeemPtRequest> = new EventEmitter<RedeemPtRequest>();
  @Output()
  appMintPTYT: EventEmitter<MintPtYtRequest> = new EventEmitter<MintPtYtRequest>();
  @Output()
  appRedeemPTYT: EventEmitter<RedeemPtYtRequest> = new EventEmitter<RedeemPtYtRequest>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-vaults', '1']);
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
