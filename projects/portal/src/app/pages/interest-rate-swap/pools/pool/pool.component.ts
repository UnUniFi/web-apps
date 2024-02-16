import { EstimationInfo, ReadableEstimationInfo } from '../../vaults/vault/vault.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { ConfigService, IRSVaultImage } from 'projects/portal/src/app/models/config.service';
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { BankService } from 'projects/portal/src/app/models/cosmos/bank.service';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
import { MintLpRequest, RedeemLpRequest } from 'projects/portal/src/app/models/irs/irs.model';
import { IrsQueryService } from 'projects/portal/src/app/models/irs/irs.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
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
  denomBalancesMap$: Observable<{ [symbol: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  ptDenom$: Observable<string>;
  lpDenom$: Observable<string>;
  vaultImage$?: Observable<IRSVaultImage | undefined>;

  tokenInAmountForMint$: BehaviorSubject<EstimationInfo | undefined>;
  estimatedMintAmount$: Observable<
    { mintAmount: number; utAmount?: number; ptAmount?: number } | undefined
  >;
  lpAmountForRedeem$: BehaviorSubject<EstimationInfo | undefined>;
  estimatedRedeemAmount$: Observable<{ utAmount: number; ptAmount: number } | undefined>;

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
    this.denomBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getDenomBalanceMap$(address)),
    );
    this.ptDenom$ = this.poolId$.pipe(map((id) => `irs/tranche/${id}/pt`));
    this.lpDenom$ = this.poolId$.pipe(map((id) => `irs/tranche/${id}/ls`));
    const images$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.vaultImage$ = combineLatest([this.contractAddress$, images$]).pipe(
      map(([contract, images]) => images.find((image) => image.contract === contract)),
    );

    this.tokenInAmountForMint$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.lpAmountForRedeem$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.estimatedMintAmount$ = this.tokenInAmountForMint$.pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateMintLiquidity(info.poolId, info.denom, info.amount);
      }),
      map((coins) => {
        if (!coins) {
          return undefined;
        }
        const additionalAmount =
          Number(coins.additional_required_amount?.amount) /
          Math.pow(10, getDenomExponent(coins.additional_required_amount?.denom || ''));
        return {
          mintAmount:
            (Number(coins.mint_amount?.amount) /
              Math.pow(10, getDenomExponent(coins.mint_amount?.denom || ''))) *
            0.99,
          utAmount: !coins.additional_required_amount?.denom?.includes('/pt')
            ? additionalAmount
            : undefined,
          ptAmount: coins.additional_required_amount?.denom?.includes('/pt')
            ? additionalAmount
            : undefined,
        };
      }),
    );
    const redeemLiquidity$ = this.lpAmountForRedeem$.pipe(
      mergeMap((info) => {
        if (!info) {
          return of(undefined);
        }
        return this.irsQuery.estimateRedeemLiquidity(info.poolId, info.amount);
      }),
    );
    this.estimatedRedeemAmount$ = combineLatest([this.vault$, redeemLiquidity$]).pipe(
      map(([vault, coins]) => {
        if (!vault || !coins) {
          return undefined;
        }
        const utCoin = coins.find((coin) => coin.denom === vault.denom);
        const ptCoin = coins.find((coin) => coin.denom?.includes('/pt'));
        return {
          utAmount: utCoin
            ? Math.floor(Number(utCoin.amount) * 0.99) /
              Math.pow(10, getDenomExponent(utCoin.denom!))
            : 0,
          ptAmount: ptCoin
            ? Math.floor(Number(ptCoin.amount) * 0.99) /
              Math.pow(10, getDenomExponent(ptCoin.denom!))
            : 0,
        };
      }),
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
    this.tokenInAmountForMint$.next({
      poolId: data.poolId,
      denom: data.denom,
      amount: coin.amount || '0',
    });
  }

  onRedeemLP(data: RedeemLpRequest) {
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
