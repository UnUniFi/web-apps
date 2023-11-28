import { SwapRequest } from '../vaults/vault/vault.component';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'view-simple-vaults',
  templateUrl: './simple-vaults.component.html',
  styleUrls: ['./simple-vaults.component.css'],
})
export class SimpleVaultsComponent implements OnInit {
  inputUnderlying?: string;
  underlyingDenom? = 'uatom';

  @Output()
  appMintPT: EventEmitter<SwapRequest> = new EventEmitter<SwapRequest>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'vaults']);
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
