import { EstimationInfo, ReadableEstimationInfo } from '../../vaults/vault/vault.component';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { IRSVaultImage, ConfigService } from 'projects/portal/src/app/models/config.service';
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { BankService } from 'projects/portal/src/app/models/cosmos/bank.service';
import { IrsApplicationService } from 'projects/portal/src/app/models/irs/irs.application.service';
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
  vault$: Observable<VaultByContract200ResponseVault | undefined>;
  tranches$: Observable<AllTranches200ResponseTranchesInner[] | undefined>;
  trancheFixedAPYs$: Observable<(TranchePtAPYs200Response | undefined)[]>;
  denomBalancesMap$: Observable<{ [symbol: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  tranchePtBalance$: Observable<number>;
  vaultImage$?: Observable<IRSVaultImage | undefined>;
  selectedPoolId$?: Observable<string | undefined>;
  selectPoolId$?: BehaviorSubject<string | undefined>;
  ptAmount$: Observable<number | undefined>;
  ptValue$: Observable<number | undefined>;

  utAmountForMintPt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateMintPt$: Observable<number | undefined>;
  ptAmountForRedeemPt$: BehaviorSubject<EstimationInfo | undefined>;
  estimateRedeemPt$: Observable<number | undefined>;
  afterPtAmount$: Observable<number>;
  afterPtValue$: Observable<number>;

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
    this.vault$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.getVaultByContract$(contract)),
    );
    this.tranches$ = this.contractAddress$.pipe(
      mergeMap((contract) => this.irsQuery.listTranchesByContract$(contract)),
    );
    this.selectPoolId$ = new BehaviorSubject<string | undefined>(undefined);
    this.selectedPoolId$ = combineLatest([this.tranches$, this.selectPoolId$.asObservable()]).pipe(
      map(([tranches, selected]) => {
        if (selected) {
          console.log(selected);
          return selected;
        }
        return tranches ? tranches[0].id : undefined;
      }),
    );

    this.trancheFixedAPYs$ = this.tranches$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches
            ? tranches.map(async (tranche) =>
                tranche.id ? await this.irsQuery.getTranchePtAPYs(tranche.id) : undefined,
              )
            : [],
        ),
      ),
    );
    this.denomBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getDenomBalanceMap$(address)),
    );
    this.tranchePtBalance$ = combineLatest([this.selectedPoolId$, this.denomBalancesMap$]).pipe(
      map(([poolId, denomBalancesMap]) => {
        const denom = `irs/tranche/${poolId}/pt`;
        const balance = denomBalancesMap[denom];
        if (!balance) {
          return 0;
        }
        const exponent = getDenomExponent(denom);
        return Number(balance?.amount || 0) / Math.pow(10, exponent);
      }),
    );
    const ptBalances$ = combineLatest([this.tranches$, this.denomBalancesMap$]).pipe(
      map(([tranches, denomBalancesMap]) =>
        tranches?.map(
          (tranche) =>
            denomBalancesMap[`irs/tranche/${tranche.id}/pt`] || {
              amount: '0',
              denom: `irs/tranche/${tranche.id}/pt`,
            },
        ),
      ),
    );
    this.ptAmount$ = ptBalances$.pipe(
      map((ptBalances) => ptBalances?.reduce((a, b) => a + Number(b.amount), 0)),
    );
    this.ptValue$ = combineLatest([ptBalances$, this.trancheFixedAPYs$]).pipe(
      map(([ptBalance, fixedAPYs]) => {
        let value = 0;
        if (!ptBalance?.length) {
          return value;
        }
        for (let i = 0; i < ptBalance.length; i++) {
          if (ptBalance[i] && fixedAPYs[i]) {
            if (fixedAPYs[i]?.pt_rate_per_deposit) {
              value += Number(ptBalance[i].amount) / Number(fixedAPYs[i]?.pt_rate_per_deposit);
            }
          }
        }
        return Math.floor(value);
      }),
    );
    const images$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.vaultImage$ = combineLatest([this.contractAddress$, images$]).pipe(
      map(([contract, images]) => images.find((image) => image.contract === contract)),
    );

    this.utAmountForMintPt$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
    this.ptAmountForRedeemPt$ = new BehaviorSubject<EstimationInfo | undefined>(undefined);
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
        return Number(coin.amount);
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
        return Number(coin.amount);
      }),
    );
    this.afterPtAmount$ = combineLatest([
      this.ptAmount$,
      this.ptAmountForRedeemPt$.asObservable(),
      this.estimateMintPt$,
    ]).pipe(
      map(
        ([ptAmount, redeemPt, mintPt]) =>
          (ptAmount || 0) - Number(redeemPt?.amount || 0) + (mintPt || 0),
      ),
    );
    this.afterPtValue$ = combineLatest([
      this.ptValue$,
      this.tranches$,
      this.selectedPoolId$,
      this.trancheFixedAPYs$,
      this.ptAmountForRedeemPt$.asObservable(),
      this.estimateMintPt$,
    ]).pipe(
      map(([ptValue, tranches, id, fixedAPYs, redeemPt, mintPt]) => {
        const index = tranches?.findIndex((tranche) => tranche?.id === id);
        if (!index || !fixedAPYs[index]?.pt_rate_per_deposit) {
          return ptValue || 0;
        }
        const rate = Number(fixedAPYs[index]?.pt_rate_per_deposit);
        return (ptValue || 0) + (mintPt || 0) / rate - Number(redeemPt?.amount || 0) / rate;
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
  onDeleteDeposit(data: {}) {
    this.utAmountForMintPt$.next(undefined);
  }
  onDeleteWithdraw(data: {}) {
    this.ptAmountForRedeemPt$.next(undefined);
  }
  onSelectTranche(id: string) {
    this.selectPoolId$?.next(id);
  }
}
