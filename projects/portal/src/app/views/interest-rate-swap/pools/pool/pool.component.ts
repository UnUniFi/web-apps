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
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { ReadableEstimationInfo } from 'projects/portal/src/app/pages/interest-rate-swap/vaults/vault/vault.component';
import {
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
  TrancheYtAPYs200Response,
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
  trancheYtAPYs?: TrancheYtAPYs200Response | null;
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
  @Input()
  lpBalanceUSD?: number | null;
  @Input()
  totalLiquidityUSD?: { total: number; assets: { [denom: string]: number } } | null;
  @Input()
  txMode?: 'deposit' | 'redeem' | null;
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
  @Output()
  appChangeTxMode: EventEmitter<'deposit' | 'redeem'> = new EventEmitter<'deposit' | 'redeem'>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.estimatedMintAmount?.utAmount) {
      this.inputUT = this.estimatedMintAmount?.utAmount.toString();
    } else if (this.estimatedMintAmount?.ptAmount) {
      this.inputPT = this.estimatedMintAmount?.ptAmount.toString();
    } else if (this.inputPT && !this.inputUT) {
      this.inputUT = this.inputPT;
    } else if (this.inputUT && !this.inputPT) {
      this.inputPT = this.inputUT;
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
    if (!this.vault?.deposit_denom) {
      alert('Invalid vault denom.');
      return;
    }
    this.appMintLP.emit({
      trancheId: this.poolId,
      lpReadableAmount: this.estimatedMintAmount.mintAmount,
      lpDenom: `irs/tranche/${this.poolId}/ls`,
      readableAmountMapInMax: {
        [`irs/tranche/${this.poolId}/pt`]: Number(this.inputPT),
        [this.vault.deposit_denom]: Number(this.inputUT),
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
    if (this.poolId && this.inputUT && this.vault?.deposit_denom) {
      this.appChangeMintLP.emit({
        poolId: this.poolId,
        denom: this.vault.deposit_denom,
        readableAmount: Number(this.inputUT),
      });
    }
  }

  onChangeDepositPt() {
    if (this.poolId && this.inputPT) {
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

  calcUnderlyingAPY(
    poolApy: TranchePoolAPYs200Response | null | undefined,
    ytApy: TrancheYtAPYs200Response | null | undefined,
  ): number {
    let apy = 0;
    if (poolApy && ytApy) {
      apy += Number(ytApy.ls_apy) * Number(poolApy.pt_percentage_in_pool);
    }
    return apy;
  }

  calcTotalPoolAPY(
    poolApy: TranchePoolAPYs200Response | null | undefined,
    ytApy: TrancheYtAPYs200Response | null | undefined,
  ): number {
    let apy = 0;
    if (poolApy) {
      apy += Number(poolApy.liquidity_apy) + Number(poolApy.discount_pt_apy);
      if (ytApy) {
        apy += Number(ytApy.ls_apy) * Number(poolApy.pt_percentage_in_pool);
      }
    }
    return apy;
  }

  inputMaxUT() {
    if (this.denomBalancesMap && this.vault?.deposit_denom) {
      const balance = this.denomBalancesMap[this.vault.deposit_denom];
      if (balance) {
        const exponent = getDenomExponent(this.vault.deposit_denom);
        const amount = Number(balance.amount) / Math.pow(10, exponent);
        this.inputUT = amount.toString();
        this.onChangeDepositUt();
      }
    }
  }

  inputMaxPT() {
    if (this.denomBalancesMap && this.ptDenom) {
      const balance = this.denomBalancesMap[this.ptDenom];
      if (balance) {
        const amount = Number(balance.amount) / Math.pow(10, 6);
        this.inputPT = amount.toString();
        this.onChangeDepositPt();
      }
    }
  }

  inputMaxLP() {
    if (this.denomBalancesMap && this.lpDenom) {
      const balance = this.denomBalancesMap[this.lpDenom];
      if (balance) {
        const amount = Number(balance.amount) / Math.pow(10, 6);
        this.inputLP = amount.toString();
        this.onChangeWithdraw();
      }
    }
  }

  onChangeTxMode(mode: 'deposit' | 'redeem') {
    this.txMode = mode;
    this.appChangeTxMode.emit(mode);
  }
}
