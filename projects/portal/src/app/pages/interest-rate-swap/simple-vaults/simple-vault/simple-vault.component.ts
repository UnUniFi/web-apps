import { EstimationInfo, ReadableEstimationInfo } from '../../vaults/vault/vault.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { BankService } from 'projects/portal/src/app/models/cosmos/bank.service';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import {
  dummyFixedAPYs,
  dummyTranchePools,
  dummyVaults,
} from 'projects/portal/src/app/models/irs/irs.dummy';
import { MintPtRequest, RedeemPtRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  AllTranches200ResponseTranchesInner,
  VaultByContract200ResponseVault,
  TranchePtAPYs200Response,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-simple-vault',
  templateUrl: './simple-vault.component.html',
  styleUrls: ['./simple-vault.component.css'],
})
export class SimpleVaultComponent implements OnInit {
  address$: Observable<string>;
  contractAddress$: Observable<string>;
  vault$: Observable<VaultByContract200ResponseVault>;
  tranches$: Observable<AllTranches200ResponseTranchesInner[]>;
  trancheFixedAPYs$: Observable<(TranchePtAPYs200Response | undefined)[]>;
  underlyingDenom$?: Observable<string | undefined>;
  // vaultDetails$: Observable<(VaultDetails200Response | undefined)[]>;
  vaultBalances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  utAmountForMintPt$: BehaviorSubject<EstimationInfo>;
  estimateMintPt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;
  ptAmountForRedeemPt$: BehaviorSubject<EstimationInfo>;
  estimateRedeemPt$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly irsQuery: IrsQueryService,
    private readonly irsAppService: IrsApplicationService,
    private readonly bankService: BankService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.contractAddress$ = this.route.params.pipe(map((params) => params.contract));
    this.vault$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.getVaultByContract$(contract)),
    );
    this.tranches$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.listTranchesByContract$(contract)),
    );
    this.trancheFixedAPYs$ = this.tranches$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id ? await this.irsQuery.getTranchePtAPYs$(tranche.id).toPromise() : undefined,
          ),
        ),
      ),
    );
    this.underlyingDenom$ = this.tranches$.pipe(
      map((tranches) => {
        const tranche = tranches[0];
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
    const balances$ = this.address$.pipe(mergeMap((addr) => this.bankQuery.getBalance$(addr)));
    this.vaultBalances$ = combineLatest([balances$, this.tranches$]).pipe(
      map(([balance, tranches]) =>
        balance.filter((balance) =>
          tranches.some((tranche) => balance.denom?.includes(`irs/tranche/${tranche.id}/pt`)),
        ),
      ),
    );

    const initialEstimationInfo = new BehaviorSubject({
      poolId: '',
      denom: '',
      amount: '0',
    });
    this.utAmountForMintPt$ = initialEstimationInfo;
    this.ptAmountForRedeemPt$ = initialEstimationInfo;
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

    this.vault$ = of(dummyVaults[0]);
    this.underlyingDenom$ = of('uatom');
    this.tranches$ = of(dummyTranchePools.slice(0, 3));
    this.trancheFixedAPYs$ = of(dummyFixedAPYs.slice(0, 3));
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
}
