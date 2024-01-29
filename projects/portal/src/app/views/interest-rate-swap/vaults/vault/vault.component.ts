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
import {
  MintPtRequest,
  MintPtYtRequest,
  MintYtRequest,
  RedeemPtRequest,
  RedeemPtYtRequest,
  RedeemYtRequest,
} from 'projects/portal/src/app/models/irs/irs.model';
import { ReadableEstimationInfo } from 'projects/portal/src/app/pages/interest-rate-swap/vaults/vault/vault.component';
import {
  AllTranches200ResponseTranchesInner,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'view-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit, OnChanges {
  @Input()
  contractAddress?: string | null;
  @Input()
  vault?: VaultByContract200ResponseVault | null;
  @Input()
  trancheId?: string | null;
  @Input()
  tranchePool?: AllTranches200ResponseTranchesInner | null;
  @Input()
  trancheYtAPYs?: TrancheYtAPYs200Response | null;
  @Input()
  tranchePtAPYs?: TranchePtAPYs200Response | null;
  @Input()
  denomBalancesMap?: { [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin } | null;
  @Input()
  ptDenom?: string | null;
  @Input()
  ytDenom?: string | null;
  @Input()
  estimateMintPt?: number | null;
  @Input()
  estimateRedeemPt?: number | null;
  @Input()
  estimateMintPtYt?: { ptAmount: number; ytAmount: number } | null;
  @Input()
  estimateRedeemPtYt?: { redeemAmount: number; ytAmount?: number; ptAmount?: number } | null;
  @Input()
  estimateMintYt?: number | null;
  @Input()
  estimateRedeemMaturedYt?: number | null;
  @Input()
  swapTab?: 'pt' | 'yt' | null;
  @Input()
  vaultImage?: IRSVaultImage | null;

  inputUT?: string;
  inputYT?: string;
  inputPT?: string;
  inputYtPair?: string;
  inputPtPair?: string;

  modeTab: 'swap' | 'mint' = 'swap';
  txTab: 'all' | 'swap' | 'liquidity' = 'all';
  txMode: 'mint' | 'redeem' = 'mint';

  @Output()
  appMintPT: EventEmitter<MintPtRequest> = new EventEmitter<MintPtRequest>();
  @Output()
  appChangeMintPT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appRedeemPT: EventEmitter<RedeemPtRequest> = new EventEmitter<RedeemPtRequest>();
  @Output()
  appChangeRedeemPT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appMintPTYT: EventEmitter<MintPtYtRequest> = new EventEmitter<MintPtYtRequest>();
  @Output()
  appChangeMintPTYT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appRedeemPTYT: EventEmitter<RedeemPtYtRequest> = new EventEmitter<RedeemPtYtRequest>();
  @Output()
  appChangeRedeemPTYT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appMintYT: EventEmitter<MintYtRequest> = new EventEmitter<MintYtRequest>();
  @Output()
  appChangeMintYT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();
  @Output()
  appRedeemYT: EventEmitter<RedeemYtRequest> = new EventEmitter<RedeemYtRequest>();
  @Output()
  appChangeRedeemYT: EventEmitter<ReadableEstimationInfo> =
    new EventEmitter<ReadableEstimationInfo>();

  constructor(private router: Router) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.estimateRedeemPtYt) {
      if (this.estimateRedeemPtYt?.ptAmount) {
        this.inputPtPair = this.estimateRedeemPtYt.ptAmount.toString();
      }
      if (this.estimateRedeemPtYt?.ytAmount) {
        this.inputYtPair = this.estimateRedeemPtYt.ytAmount.toString();
      }
    }
  }

  changeSimple() {
    this.router.navigate(['interest-rate-swap', 'simple-vaults', this.contractAddress]);
  }

  calcMaturity(pool: AllTranches200ResponseTranchesInner): number {
    const maturity = Number(pool.maturity) + Number(pool.start_time);
    return maturity * 1000;
  }

  isMatured(pool: AllTranches200ResponseTranchesInner): boolean {
    return this.calcMaturity(pool) * 1000 < Date.now();
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

  onSubmitSwapMint() {
    if (!this.trancheId) {
      alert('Invalid tranche ID.');
      return;
    }
    if (!this.inputUT) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.vault?.denom) {
      alert('Invalid vault denom.');
      return;
    }
    if (this.swapTab === 'pt') {
      this.appMintPT.emit({
        trancheId: this.trancheId,
        trancheType: 1,
        utDenom: this.vault.denom,
        readableAmount: Number(this.inputUT),
      });
    }
    if (this.swapTab === 'yt') {
      if (!this.estimateMintYt) {
        alert('Invalid required YT amount.');
        return;
      }
      this.appMintYT.emit({
        trancheId: this.trancheId,
        trancheType: 2,
        utDenom: this.vault.denom,
        readableAmount: Number(this.inputUT),
        requiredYT: Number(this.estimateMintYt),
      });
    }
  }

  onSubmitSwapRedeem() {
    if (!this.trancheId) {
      alert('Invalid tranche ID.');
      return;
    }
    if (this.swapTab === 'pt') {
      if (!this.inputPT) {
        alert('Please input the PT token amount.');
        return;
      }
      this.appRedeemPT.emit({
        trancheId: this.trancheId,
        trancheType: 1,
        ptDenom: `irs/tranche/${this.trancheId}/pt`,
        readableAmount: Number(this.inputPT),
      });
    }
    if (this.swapTab === 'yt') {
      if (!this.inputYT) {
        alert('Please input the YT token amount.');
        return;
      }
      if (!this.vault?.denom) {
        alert('Invalid vault denom.');
        return;
      }
      this.appRedeemYT.emit({
        trancheId: this.trancheId,
        trancheType: 2,
        ytDenom: `irs/tranche/${this.trancheId}/yt`,
        readableAmount: Number(this.inputYT),
        utDenom: this.vault.denom,
        requiredUT: Number(this.estimateRedeemMaturedYt),
      });
    }
  }

  onSubmitMint() {
    if (!this.trancheId) {
      alert('Invalid tranche ID.');
      return;
    }
    if (!this.inputUT) {
      alert('Please input the token amount.');
      return;
    }
    if (!this.vault?.denom) {
      alert('Invalid vault denom.');
      return;
    }
    this.appMintPTYT.emit({
      trancheId: this.trancheId,
      trancheType: 0,
      utDenom: this.vault.denom,
      readableAmount: Number(this.inputUT),
    });
  }

  onSubmitRedeem() {
    if (!this.trancheId) {
      alert('Invalid tranche ID.');
      return;
    }
    if (!this.vault?.denom) {
      alert('Invalid vault denom.');
      return;
    }
    if (!this.estimateRedeemPtYt) {
      alert('Unable to redeem YT.');
      return;
    }
    const ptAmount = this.estimateRedeemPtYt.ptAmount ?? Number(this.inputPT);
    const ytAmount = this.estimateRedeemPtYt.ytAmount ?? Number(this.inputYT);
    this.appRedeemPTYT.emit({
      trancheId: this.trancheId,
      trancheType: 0,
      readableAmountMap: {
        [`irs/tranche/${this.trancheId}/pt`]: ptAmount,
        [`irs/tranche/${this.trancheId}/yt`]: ytAmount,
      },
      utDenom: this.vault.denom,
      requiredUT: this.estimateRedeemPtYt.redeemAmount,
    });
  }

  onChangeSwapUnderlyingAmount() {
    if (this.swapTab === 'pt' && this.trancheId && this.vault?.denom && this.inputUT) {
      this.appChangeMintPT.emit({
        poolId: this.trancheId,
        denom: this.vault.denom,
        readableAmount: Number(this.inputUT),
      });
    }
    if (this.swapTab === 'yt' && this.trancheId && this.vault?.denom && this.inputUT) {
      this.appChangeMintYT.emit({
        poolId: this.trancheId,
        denom: this.vault.denom,
        readableAmount: Number(this.inputUT),
      });
    }
  }

  onChangeSwapPtAmount() {
    if (this.swapTab === 'pt' && this.trancheId && this.vault?.denom && this.inputPT) {
      this.appChangeRedeemPT.emit({
        poolId: this.trancheId,
        denom: `irs/tranche/${this.trancheId}/pt`,
        readableAmount: Number(this.inputPT),
      });
    }
  }

  onChangeSwapYtAmount() {
    if (this.swapTab === 'yt' && this.trancheId && this.vault?.denom && this.inputYT) {
      this.appChangeRedeemYT.emit({
        poolId: this.trancheId,
        denom: `irs/tranche/${this.trancheId}/yt`,
        readableAmount: Number(this.inputYT),
      });
    }
  }

  onChangeMintUnderlyingAmount() {
    if (this.trancheId && this.vault?.denom && this.inputUT) {
      this.appChangeMintPTYT.emit({
        poolId: this.trancheId,
        denom: this.vault.denom,
        readableAmount: Number(this.inputUT),
      });
    }
  }

  onChangeRedeemPtAmount() {
    if (this.trancheId && this.inputPtPair) {
      this.appChangeRedeemPTYT.emit({
        poolId: this.trancheId,
        denom: `irs/tranche/${this.trancheId}/pt`,
        readableAmount: Number(this.inputPtPair),
      });
    }
  }

  onChangeRedeemYtAmount() {
    if (this.trancheId && this.inputPtPair) {
      this.appChangeRedeemPTYT.emit({
        poolId: this.trancheId,
        denom: `irs/tranche/${this.trancheId}/yt`,
        readableAmount: Number(this.inputYtPair),
      });
    }
  }

  inputSwapMaxUT() {
    if (this.denomBalancesMap && this.vault?.denom) {
      const balance = this.denomBalancesMap[this.vault.denom];
      if (balance) {
        const exponent = getDenomExponent(this.vault.denom);
        const amount = Number(balance.amount) / Math.pow(10, exponent);
        this.inputUT = amount.toString();
        this.onChangeSwapUnderlyingAmount();
      }
    }
  }

  inputMintMaxUT() {
    if (this.denomBalancesMap && this.vault?.denom) {
      const balance = this.denomBalancesMap[this.vault.denom];
      if (balance) {
        const exponent = getDenomExponent(this.vault.denom);
        const amount = Number(balance.amount) / Math.pow(10, exponent);
        this.inputUT = amount.toString();
        this.onChangeMintUnderlyingAmount();
      }
    }
  }

  inputSwapMaxYT() {
    if (this.denomBalancesMap && this.ytDenom) {
      const balance = this.denomBalancesMap[this.ytDenom];
      if (balance) {
        const amount = Number(balance.amount) / Math.pow(10, 6);
        this.inputYT = amount.toString();
        this.onChangeSwapYtAmount();
      }
    }
  }

  inputRedeemMaxYT() {
    if (this.denomBalancesMap && this.ytDenom) {
      const balance = this.denomBalancesMap[this.ytDenom];
      if (balance) {
        const amount = Number(balance.amount) / Math.pow(10, 6);
        this.inputYT = amount.toString();
        this.onChangeRedeemYtAmount();
      }
    }
  }

  inputSwapMaxPT() {
    if (this.denomBalancesMap && this.ptDenom) {
      const balance = this.denomBalancesMap[this.ptDenom];
      if (balance) {
        const amount = Number(balance.amount) / Math.pow(10, 6);
        this.inputPT = amount.toString();
        this.onChangeSwapPtAmount();
      }
    }
  }

  inputRedeemMaxPT() {
    if (this.denomBalancesMap && this.ptDenom) {
      const balance = this.denomBalancesMap[this.ptDenom];
      if (balance) {
        const amount = Number(balance.amount) / Math.pow(10, 6);
        this.inputPT = amount.toString();
        this.onChangeRedeemPtAmount();
      }
    }
  }
}
