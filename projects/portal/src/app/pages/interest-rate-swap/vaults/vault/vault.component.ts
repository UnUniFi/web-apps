import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
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
import { BehaviorSubject, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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
  contractAddress$: Observable<string>;
  vault$: Observable<VaultByContract200ResponseVault>;
  trancheId$: Observable<string>;
  tranchePool$: Observable<AllTranches200ResponseTranchesInner>;
  underlyingDenom$?: Observable<string | undefined>;
  trancheYtAPYs$: Observable<TrancheYtAPYs200Response>;
  tranchePtAPYs$: Observable<TranchePtAPYs200Response>;
  swapTab$: Observable<'pt' | 'yt'>;
  // vaultDetails$: Observable<(VaultDetails200Response | undefined)[]>;

  utAmountForMintPt$: BehaviorSubject<EstimationInfo>;
  estimateMintPt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;
  ptAmountForRedeemPt$: BehaviorSubject<EstimationInfo>;
  estimateRedeemPt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;
  utAmountForMintPtYt$: BehaviorSubject<EstimationInfo>;
  estimateMintPtYt$: Observable<EstimateMintPtYtPair200Response>;
  tokenInAmountForRedeemPtYt$: BehaviorSubject<EstimationInfo>;
  estimateRedeemPtYt$: Observable<EstimateRedeemPtYtPair200Response>;
  desiredYtAmountForMintYt$: BehaviorSubject<EstimationInfo>;
  estimateRequiredUtMintYt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;
  ytAmountForRedeemYt$: BehaviorSubject<EstimationInfo>;
  estimateRedeemMaturedYt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;

  constructor(
    private route: ActivatedRoute,
    private readonly irsQuery: IrsQueryService,
    private readonly irsAppService: IrsApplicationService,
    private readonly bankService: BankService,
  ) {
    this.contractAddress$ = this.route.params.pipe(map((params) => params.contract));
    this.vault$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.getVaultByContract$(contract)),
    );
    this.trancheId$ = this.route.params.pipe(map((params) => params.id));
    this.tranchePool$ = this.trancheId$.pipe(mergeMap((id) => this.irsQuery.getTranche$(id)));
    this.underlyingDenom$ = this.tranchePool$.pipe(
      map((tranche) => {
        if (tranche.pool_assets) {
          for (const asset of tranche.pool_assets) {
            if (!asset.denom?.includes('irs/tranche/')) {
              return asset.denom;
            }
          }
        }
        return undefined;
      }),
    );
    this.trancheYtAPYs$ = this.trancheId$.pipe(
      mergeMap((id) => this.irsQuery.getTrancheYtAPYs$(id)),
    );
    this.tranchePtAPYs$ = this.trancheId$.pipe(
      mergeMap((id) => this.irsQuery.getTranchePtAPYs$(id)),
    );
    this.swapTab$ = this.route.queryParams.pipe(map((params) => params.view || 'pt'));
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

    const initialEstimationInfo = new BehaviorSubject({
      poolId: '',
      denom: '',
      amount: '0',
    });
    this.utAmountForMintPt$ = initialEstimationInfo;
    this.ptAmountForRedeemPt$ = initialEstimationInfo;
    this.utAmountForMintPtYt$ = initialEstimationInfo;
    this.tokenInAmountForRedeemPtYt$ = initialEstimationInfo;
    this.desiredYtAmountForMintYt$ = initialEstimationInfo;
    this.ytAmountForRedeemYt$ = initialEstimationInfo;
    this.estimateMintPt$ = this.utAmountForMintPt$
      .asObservable()
      .pipe(
        mergeMap((info) => this.irsQuery.estimateSwapInPool$(info.poolId, info.denom, info.amount)),
      );
    this.estimateRedeemPt$ = this.ptAmountForRedeemPt$
      .asObservable()
      .pipe(
        mergeMap((info) => this.irsQuery.estimateSwapInPool$(info.poolId, info.denom, info.amount)),
      );
    this.estimateMintPtYt$ = this.utAmountForMintPtYt$
      .asObservable()
      .pipe(
        mergeMap((info) =>
          this.irsQuery.estimateMintPtYtPair$(info.poolId, info.denom, info.amount),
        ),
      );
    this.estimateRedeemPtYt$ = this.tokenInAmountForRedeemPtYt$
      .asObservable()
      .pipe(
        mergeMap((info) =>
          this.irsQuery.estimateRedeemPtYtPair$(info.poolId, info.denom, info.amount),
        ),
      );
    this.estimateRequiredUtMintYt$ = this.ytAmountForRedeemYt$
      .asObservable()
      .pipe(mergeMap((info) => this.irsQuery.estimateRequiredUtMintYt$(info.poolId, info.amount)));
    this.estimateRedeemMaturedYt$ = this.ytAmountForRedeemYt$
      .asObservable()
      .pipe(mergeMap((info) => this.irsQuery.estimateRedeemMaturedYt$(info.poolId, info.amount)));
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
    this.desiredYtAmountForMintYt$.next({
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
