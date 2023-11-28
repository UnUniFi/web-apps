import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SwapRequest } from 'projects/portal/src/app/models/interest-rate-swap/interest-rate-swap.model';

@Component({
  selector: 'view-simple-vault',
  templateUrl: './simple-vault.component.html',
  styleUrls: ['./simple-vault.component.css'],
})
export class SimpleVaultComponent implements OnInit {
  inputUnderlying?: string;
  underlyingDenom? = 'uatom';

  @Output()
  appMintPT: EventEmitter<SwapRequest> = new EventEmitter<SwapRequest>();

  description = 'This Vault provides the fixed yield of stATOM.';
  tab: 'deposit' | 'withdraw' = 'deposit';

  constructor(private router: Router) {}

  ngOnInit(): void {}

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
    this.appMintPT.emit({
      readableAmount: this.inputUnderlying,
      denom: this.underlyingDenom,
    });
  }
}
