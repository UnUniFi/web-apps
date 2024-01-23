import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService, IRSVaultImage } from 'projects/portal/src/app/models/config.service';
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
  EstimateMintPtYtPair200Response,
  EstimateRedeemPtYtPair200Response,
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
  // vaultDetails$: Observable<(VaultDetails200Response | undefined)[]>;

  utAmountForMintPt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateMintPt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  ptAmountForRedeemPt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateRedeemPt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  utAmountForMintPtYt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateMintPtYt$: Observable<EstimateMintPtYtPair200Response | undefined>;
  tokenInAmountForRedeemPtYt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateRedeemPtYt$: Observable<EstimateRedeemPtYtPair200Response | undefined>;
  utAmountForMintYt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateMintYt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;
  ytAmountForRedeemYt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateRedeemMaturedYt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;

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
    // this.vaultDetails$ = this.tranches$.pipe(
    //   mergeMap((tranches) =>
    //     Promise.all(
    //       tranches.map(async (tranche) =>
    //         tranche.strategy_contract && tranche.maturity
    //           ? await this.irsQuery
    //               .getVaultDetail$(tranche.strategy_contract, tranche.maturity)
    //               .toPromise()
    //           : undefined,
    //       ),
    //     ),
    //   ),
    // );

    const initialEstimationInfo = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.utAmountForMintPt$ = initialEstimationInfo;
    this.ptAmountForRedeemPt$ = initialEstimationInfo;
    this.utAmountForMintPtYt$ = initialEstimationInfo;
    this.utAmountForMintPtYt$.subscribe((info) => console.log(info));
    this.tokenInAmountForRedeemPtYt$ = initialEstimationInfo;
    this.utAmountForMintYt$ = initialEstimationInfo;
    this.ytAmountForRedeemYt$ = initialEstimationInfo;
    this.estimateMintPt$ = this.utAmountForMintPt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateSwapInPool$(info.poolId, info.denom, info.amount);
      }),
    );
    this.estimateRedeemPt$ = this.ptAmountForRedeemPt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateSwapInPool$(info.poolId, info.denom, info.amount);
      }),
    );
    this.estimateMintPtYt$ = this.utAmountForMintPtYt$.asObservable().pipe(
      mergeMap((info) => {
        console.log(info);
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateMintPtYtPair$(info.poolId, info.denom, info.amount);
      }),
    );
    this.estimateRedeemPtYt$ = this.tokenInAmountForRedeemPtYt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateRedeemPtYtPair$(info.poolId, info.denom, info.amount);
      }),
    );
    this.estimateMintYt$ = this.ytAmountForRedeemYt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateSwapUtToYt$(info.poolId, info.denom, info.amount);
      }),
    );
    this.estimateRedeemMaturedYt$ = this.ytAmountForRedeemYt$.asObservable().pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateRedeemMaturedYt$(info.poolId, info.amount);
      }),
    );
  }

  ngOnInit(): void {}

  onMintPT(data: MintPtRequest) {
    // swap UT -> PT
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
    // swap PT -> UT
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
    // mint UT -> PT + YT
    this.irsAppService.mintPTYT(data);
  }
  onChangeMintPTYT(data: ReadableEstimationInfo) {
    console.log(data);
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
