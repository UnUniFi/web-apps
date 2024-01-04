import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { MintPtRequest } from 'projects/portal/src/app/models/irs/irs.model';
import {
  AllTranches200ResponseTranchesInner,
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
  vaultBalances?: cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null;

  inputUnderlying?: string;
  underlyingDenom? = 'uatom';

  @Output()
  appMintPT: EventEmitter<MintPtRequest> = new EventEmitter<MintPtRequest>();

  description = 'This Vault provides the fixed yield of stATOM.';
  tab: 'deposit' | 'withdraw' = 'deposit';
  selectedMaturity?: string;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  changeAdvanced() {
    this.router.navigate(['interest-rate-swap', 'vaults', '1']);
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
}
