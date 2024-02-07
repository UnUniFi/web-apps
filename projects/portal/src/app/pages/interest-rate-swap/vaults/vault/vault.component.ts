import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService, IRSVaultImage } from 'projects/portal/src/app/models/config.service';
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { BankService } from 'projects/portal/src/app/models/cosmos/bank.service';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import {
  MintPtRequest,
  MintPtYtRequest,
  MintYtRequest,
  RedeemPtRequest,
  RedeemPtYtRequest,
  RedeemYtRequest,
} from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  AllTranches200ResponseTranchesInner,
  TranchePtAPYs200Response,
  TrancheYtAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

export interface EstimationInfo {
  poolId: string;
  denom: string;
  amount: string;
}

export interface ReadableEstimationInfo {
  poolId: string;
  denom: string;
  readableAmount: number;
}

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  address$: Observable<string>;
  contractAddress$: Observable<string>;
  vault$: Observable<VaultByContract200ResponseVault>;
  trancheId$: Observable<string>;
  tranchePool$: Observable<AllTranches200ResponseTranchesInner>;
  trancheYtAPYs$: Observable<TrancheYtAPYs200Response>;
  tranchePtAPYs$: Observable<TranchePtAPYs200Response>;
  swapTab$: Observable<'pt' | 'yt'>;
  vaultImage$?: Observable<IRSVaultImage | undefined>;
  denomBalancesMap$: Observable<{ [symbol: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  ptDenom$: Observable<string>;
  ytDenom$: Observable<string>;

  utAmountForMintPt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateMintPt$: Observable<number | undefined>;
  ptAmountForRedeemPt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateRedeemPt$: Observable<number | undefined>;
  utAmountForMintPtYt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateMintPtYt$: Observable<{ ptAmount: number; ytAmount: number } | undefined>;
  tokenInAmountForRedeemPtYt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateRedeemPtYt$: Observable<
    { redeemAmount: number; ytAmount?: number; ptAmount?: number } | undefined
  >;
  utAmountForMintYt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateMintYt$: Observable<number | undefined>;
  ytAmountForRedeemYt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateRedeemMaturedYt$: Observable<number | undefined>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly irsQuery: IrsQueryService,
    private readonly irsAppService: IrsApplicationService,
    private readonly bankService: BankService,
    private readonly bankQuery: BankQueryService,
    private readonly configS: ConfigService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.contractAddress$ = this.route.params.pipe(map((params) => params.contract));
    this.vault$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.getVaultByContract$(contract)),
    );
    this.trancheId$ = this.route.params.pipe(map((params) => params.id));
    this.tranchePool$ = this.trancheId$.pipe(mergeMap((id) => this.irsQuery.getTranche$(id)));
    this.trancheYtAPYs$ = this.trancheId$.pipe(
      mergeMap((id) => this.irsQuery.getTrancheYtAPYs$(id)),
    );
    this.tranchePtAPYs$ = this.trancheId$.pipe(
      mergeMap((id) => this.irsQuery.getTranchePtAPYs$(id)),
    );
    this.swapTab$ = this.route.queryParams.pipe(map((params) => params.view || 'pt'));
    const images$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.vaultImage$ = combineLatest([this.contractAddress$, images$]).pipe(
      map(([contract, images]) => images.find((image) => image.contract === contract)),
    );
    this.denomBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getDenomBalanceMap$(address)),
    );
    this.ptDenom$ = this.trancheId$.pipe(map((id) => `irs/tranche/${id}/pt`));
    this.ytDenom$ = this.trancheId$.pipe(map((id) => `irs/tranche/${id}/yt`));

    this.utAmountForMintPt$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.utAmountForMintYt$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.ptAmountForRedeemPt$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.utAmountForMintPtYt$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.tokenInAmountForRedeemPtYt$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.ytAmountForRedeemYt$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.estimateMintPt$ = this.utAmountForMintPt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateSwapInPool$(info.poolId, info.denom, info.amount);
      }),
      map((coin) => {
        if (!coin) {
          return undefined;
        }
        const exponent = getDenomExponent(coin.denom || '');
        return Number(coin.amount) / Math.pow(10, exponent);
      }),
    );
    this.estimateRedeemPt$ = this.ptAmountForRedeemPt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateSwapInPool$(info.poolId, info.denom, info.amount);
      }),
      map((coin) => {
        if (!coin) {
          return undefined;
        }
        const exponent = getDenomExponent(coin.denom || '');
        return Number(coin.amount) / Math.pow(10, exponent);
      }),
    );
    this.estimateMintPtYt$ = this.utAmountForMintPtYt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateMintPtYtPair$(info.poolId, info.denom, info.amount);
      }),
      map((coins) => {
        if (!coins) {
          return undefined;
        }
        return {
          ptAmount:
            Number(coins.pt_amount?.amount) /
            Math.pow(10, getDenomExponent(coins.pt_amount?.denom || '')),
          ytAmount:
            Number(coins.yt_amount?.amount) /
            Math.pow(10, getDenomExponent(coins.yt_amount?.denom || '')),
        };
      }),
    );
    this.estimateRedeemPtYt$ = this.tokenInAmountForRedeemPtYt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateRedeemPtYtPair$(info.poolId, info.denom, info.amount);
      }),
      map((coins) => {
        if (!coins) {
          return undefined;
        }
        const additionalAmount =
          Number(coins.additional_required_amount?.amount) /
          Math.pow(10, getDenomExponent(coins.additional_required_amount?.denom || ''));
        return {
          redeemAmount:
            (Number(coins.redeem_amount?.amount) /
              Math.pow(10, getDenomExponent(coins.redeem_amount?.denom || ''))) *
            0.99,
          ytAmount: coins.additional_required_amount?.denom?.includes('/yt')
            ? additionalAmount
            : undefined,
          ptAmount: coins.additional_required_amount?.denom?.includes('/pt')
            ? additionalAmount
            : undefined,
        };
      }),
    );
    this.estimateMintYt$ = this.utAmountForMintYt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateSwapToYt$(info.poolId, info.denom, info.amount);
      }),
      map((coin) => {
        if (!coin) {
          return undefined;
        }
        const exponent = getDenomExponent(coin.denom || '');
        return (Number(coin.amount) / Math.pow(10, exponent)) * 0.99;
      }),
    );
    this.estimateRedeemMaturedYt$ = this.ytAmountForRedeemYt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateRedeemMaturedYt$(info.poolId, info.amount);
      }),
      map((coin) => {
        if (!coin) {
          return undefined;
        }
        const exponent = getDenomExponent(coin.denom || '');
        return Number(coin.amount) / Math.pow(10, exponent);
      }),
    );
  }

  ngOnInit(): void {}

  onMintPT(data: MintPtRequest) {
    // swap DepositToken -> PT
    this.irsAppService.mintPT(data);
  }
  onChangeMintPT(data: ReadableEstimationInfo) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [data.denom]: data.readableAmount,
    })[0];
    this.utAmountForMintPt$.next({
      poolId: data.poolId,
      denom: data.denom,
      amount: coin.amount || '0',
    });
  }
  onRedeemPT(data: RedeemPtRequest) {
    // swap PT -> DepositToken
    this.irsAppService.redeemPT(data);
  }
  onChangeRedeemPT(data: ReadableEstimationInfo) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [data.denom]: data.readableAmount,
    })[0];
    this.ptAmountForRedeemPt$.next({
      poolId: data.poolId,
      denom: data.denom,
      amount: coin.amount || '0',
    });
  }
  onMintPTYT(data: MintPtYtRequest) {
    // mint DepositToken -> PT + YT
    this.irsAppService.mintPTYT(data);
  }
  onChangeMintPTYT(data: ReadableEstimationInfo) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [data.denom]: data.readableAmount,
    })[0];
    this.utAmountForMintPtYt$.next({
      poolId: data.poolId,
      denom: data.denom,
      amount: coin.amount || '0',
    });
  }
  onRedeemPTYT(data: RedeemPtYtRequest) {
    this.irsAppService.redeemPTYT(data);
  }
  onChangeRedeemPTYT(data: ReadableEstimationInfo) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [data.denom]: data.readableAmount,
    })[0];
    this.tokenInAmountForRedeemPtYt$.next({
      poolId: data.poolId,
      denom: data.denom,
      amount: coin.amount || '0',
    });
  }
  onMintYT(data: MintYtRequest) {
    this.irsAppService.mintYT(data);
  }
  onChangeMintYT(data: ReadableEstimationInfo) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [data.denom]: data.readableAmount,
    })[0];
    this.utAmountForMintYt$.next({
      poolId: data.poolId,
      denom: data.denom,
      amount: coin.amount || '0',
    });
  }
  onRedeemYT(data: RedeemYtRequest) {
    this.irsAppService.redeemYT(data);
  }
  onChangeRedeemYT(data: ReadableEstimationInfo) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [data.denom]: data.readableAmount,
    })[0];
    this.ytAmountForRedeemYt$.next({
      poolId: data.poolId,
      denom: data.denom,
      amount: coin.amount || '0',
    });
  }
}
