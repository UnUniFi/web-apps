import { EstimationInfo, ReadableEstimationInfo } from '../../vaults/vault/vault.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { BankService } from 'projects/portal/src/app/models/cosmos/bank.service';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  AllTranches200ResponseTranchesInner,
  TranchePoolAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-pool',
  templateUrl: './pool.component.html',
  styleUrls: ['./pool.component.css'],
})
export class PoolComponent implements OnInit {
  address$: Observable<string>;
  contractAddress$: Observable<string>;
  poolId$: Observable<string>;
  pool$: Observable<AllTranches200ResponseTranchesInner>;
  vault$: Observable<VaultByContract200ResponseVault>;
  poolAPYs$: Observable<TranchePoolAPYs200Response>;
  underlyingDenom$?: Observable<string | undefined>;
  poolBalance$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin | undefined>;

  lpAmountForMint$: BehaviorSubject<EstimationInfo>;
  estimatedRequiredAmountForMint$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;
  lpAmountForRedeem$: BehaviorSubject<EstimationInfo>;
  estimatedRedeemAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

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
    this.poolId$ = this.route.params.pipe(map((params) => params.id));
    this.pool$ = this.poolId$.pipe(mergeMap((id) => this.irsQuery.getTranche$(id)));
    this.vault$ = this.pool$.pipe(
      mergeMap((pool) => this.irsQuery.getVaultByContract$(pool.strategy_contract!)),
    );
    this.poolAPYs$ = this.pool$.pipe(
      mergeMap((pool) => this.irsQuery.getTranchePoolAPYs$(pool.id!)),
    );
    this.underlyingDenom$ = this.pool$.pipe(
      map((pool) => {
        if (pool.pool_assets) {
          for (const asset of pool.pool_assets) {
            if (!asset.denom?.includes('irs/tranche/')) {
              return asset.denom;
            }
          }
        }
        return undefined;
      }),
    );
    const balances$ = this.address$.pipe(mergeMap((addr) => this.bankQuery.getBalance$(addr)));
    this.poolBalance$ = combineLatest([balances$, this.pool$]).pipe(
      map(([balance, pool]) =>
        balance.find((balance) => balance.denom === `irs/tranche/${pool.id}/ls`),
      ),
    );

    const initialEstimationInfo = new BehaviorSubject({
      poolId: '',
      denom: '',
      amount: '0',
    });
    this.lpAmountForMint$ = initialEstimationInfo;
    this.lpAmountForRedeem$ = initialEstimationInfo;
    this.estimatedRequiredAmountForMint$ = this.lpAmountForMint$.pipe(
      mergeMap((info) => this.irsQuery.estimateMintLiquidity(info.poolId, info.amount)),
    );
    this.estimatedRedeemAmount$ = this.lpAmountForRedeem$.pipe(
      mergeMap((info) => this.irsQuery.estimateRedeemLiquidity(info.poolId, info.amount)),
    );
  }

  ngOnInit(): void {}

  onMintLP(data: MintLpRequest) {
    this.irsAppService.mintLP(data);
  }

  onChangeMintLP(data: ReadableEstimationInfo) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [data.denom]: data.readableAmount,
    })[0];
    this.lpAmountForMint$.next({
      poolId: data.poolId,
      denom: data.denom,
      amount: coin.amount || '0',
    });
  }

  onRedeemLP(data: MintLpRequest) {
    this.irsAppService.redeemLP(data);
  }

  onChangeRedeemLP(data: ReadableEstimationInfo) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [data.denom]: data.readableAmount,
    })[0];
    this.lpAmountForRedeem$.next({
      poolId: data.poolId,
      denom: data.denom,
      amount: coin.amount || '0',
    });
  }
}
