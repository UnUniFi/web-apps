import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { IRSVaultImage } from 'projects/portal/src/app/models/config.service';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { ReadableEstimationInfo } from 'projects/portal/src/app/pages/interest-rate-swap/vaults/vault/vault.component';
import {
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit, OnChanges {
  @Input()
  contractAddress?: string | null;
  @Input()
  poolId?: string | null;
  @Input()
  pool?: AllTranches200ResponseTranchesInner | null;
  @Input()
  vault?: VaultByContract200ResponseVault | null;
  @Input()
  poolAPYs?: TranchePoolAPYs200Response | null;
  @Input()
  denomBalancesMap?: { [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin } | null;
  @Input()
  ptDenom?: string | null;
  @Input()
  lpDenom?: string | null;
  @Input()
  vaultImage?: IRSVaultImage | null;
  @Input()
  estimatedMintAmount?: { mintAmount: number; utAmount?: number; ptAmount?: number } | null;
  @Input()
  estimatedRedeemAmount?: { utAmount: number; ptAmount: number } | null;

  tab: 'deposit' | 'withdraw' = 'deposit';
  inputUT?: string;
  inputPT?: string;
  inputLP?: string;

  @Output()
  appMintLP: EventEmitter<MintLpRequest> = new EventEmitter<MintLpRequest>();
  @Output()
  appChangeMintLP: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appRedeemLP: EventEmitter<RedeemLpRequest> = new EventEmitter<RedeemLpRequest>();
  @Output()
  appChangeRedeemLP: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.estimatedMintAmount) {
      if (this.estimatedMintAmount?.utAmount) {
        this.inputUT = this.estimatedMintAmount?.utAmount.toString();
      } else if (this.estimatedMintAmount?.ptAmount) {
        this.inputPT = this.estimatedMintAmount?.ptAmount.toString();
      } else if (this.inputPT) {
        this.inputUT = this.inputPT;
      } else if (this.inputUT) {
        this.inputPT = this.inputUT;
      }
    }
  }

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-pools', this.contractAddress]);
  }

  onDepositPool() {
    if (!this.inputUT) {
      alert('Please input the UT amount.');
      return;
    }
    if (!this.inputPT) {
      alert('Please input the PT amount.');
      return;
    }
    if (!this.poolId) {
      alert('Please select the maturity.');
      return;
    }
    if (!this.estimatedMintAmount?.mintAmount) {
      alert('Invalid mint amount.');
      return;
    }
    if (!this.vault?.denom) {
      alert('Invalid vault denom.');
      return;
    }
    this.appMintLP.emit({
      trancheId: this.poolId,
      lpReadableAmount: this.estimatedMintAmount.mintAmount,
      lpDenom: `irs/tranche/${this.poolId}/ls`,
      readableAmountMapInMax: {
        [`irs/tranche/${this.poolId}/pt`]: Number(this.inputPT),
        [this.vault.denom]: Number(this.inputUT),
      },
    });
  }

  onWithdrawPool() {
    if (!this.inputLP) {
      alert('Please input the LP amount.');
      return;
    }
    if (!this.poolId) {
      alert('Please select the maturity.');
      return;
    }
    this.appRedeemLP.emit({
      trancheId: this.poolId,
      lpReadableAmount: Number(this.inputLP),
      lpDenom: `irs/tranche/${this.poolId}/ls`,
    });
  }

  onChangeDepositUt() {
    if (this.poolId && this.inputUT && this.vault?.denom) {
      this.appChangeMintLP.emit({
        poolId: this.poolId,
        denom: this.vault.denom,
        readableAmount: Number(this.inputUT),
      });
    }
  }

  onChangeDepositPt() {
    if (this.poolId && this.inputUT) {
      this.appChangeMintLP.emit({
        poolId: this.poolId,
        denom: `irs/tranche/${this.poolId}/pt`,
        readableAmount: Number(this.inputPT),
      });
    }
  }

  onChangeWithdraw() {
    if (this.poolId && this.inputLP) {
      this.appChangeRedeemLP.emit({
        poolId: this.poolId,
        denom: `irs/tranche/${this.poolId}/ls`,
        readableAmount: Number(this.inputLP),
      });
    }
  }

  calcMaturity(pool: AllTranches200ResponseTranchesInner): number {
    const maturity = Number(pool.maturity) + Number(pool.start_time);
    return maturity * 1000;
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
}
