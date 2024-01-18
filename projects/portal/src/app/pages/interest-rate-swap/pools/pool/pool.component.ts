import { EstimationInfo, ReadableEstimationInfo } from '../../vaults/vault/vault.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService, IRSVaultImage } from 'projects/portal/src/app/models/config.service';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { BankService } from 'projects/portal/src/app/models/cosmos/bank.service';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import {
  dummyPoolAPYs,
  dummyTranchePools,
  dummyVaults,
} from 'projects/portal/src/app/models/irs/irs.dummy';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  AllTranches200ResponseTranchesInner,
  EstimateMintLiquidityPoolToken200Response,
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
  vaultImage$?: Observable<IRSVaultImage | undefined>;

  tokenInAmountForMint$: BehaviorSubject<EstimationInfo>;
  estimatedMintAmount$: Observable<EstimateMintLiquidityPoolToken200Response>;
  lpAmountForRedeem$: BehaviorSubject<EstimationInfo>;
  estimatedRedeemAmount$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly irsQuery: IrsQueryService,
    private readonly irsAppService: IrsApplicationService,
    private readonly bankService: BankService,
    private readonly configS: ConfigService,
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
    const images$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.vaultImage$ = combineLatest([this.contractAddress$, images$]).pipe(
      map(([contract, images]) => images.find((image) => image.contract === contract)),
    );

    const initialEstimationInfo = new BehaviorSubject({
      poolId: '',
      denom: '',
      amount: '0',
    });
    this.tokenInAmountForMint$ = initialEstimationInfo;
    this.lpAmountForRedeem$ = initialEstimationInfo;
    this.estimatedMintAmount$ = this.tokenInAmountForMint$.pipe(
      mergeMap((info) => this.irsQuery.estimateMintLiquidity(info.poolId, info.denom, info.amount)),
    );
    this.estimatedRedeemAmount$ = this.lpAmountForRedeem$.pipe(
      mergeMap((info) => this.irsQuery.estimateRedeemLiquidity(info.poolId, info.amount)),
    );
    this.pool$ = of(dummyTranchePools[0]);
    this.vault$ = of(dummyVaults[0]);
    this.underlyingDenom$ = of('uatom');
    this.poolAPYs$ = of(dummyPoolAPYs[0]);
  }

  ngOnInit(): void {}

  onMintLP(data: MintLpRequest) {
    this.irsAppService.mintLP(data);
  }

  onChangeMintLP(data: ReadableEstimationInfo) {
    const coin = this.bankService.convertDenomReadableAmountMapToCoins({
      [data.denom]: data.readableAmount,
    })[0];
    this.tokenInAmountForMint$.next({
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
