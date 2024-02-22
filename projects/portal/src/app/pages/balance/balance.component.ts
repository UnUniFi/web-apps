import { BandProtocolService } from '../../models/band-protocols/band-protocol.service';
import { CosmosRestService } from '../../models/cosmos-rest.service';
import { BankQueryService } from '../../models/cosmos/bank.query.service';
import { DistributionApplicationService } from '../../models/cosmos/distribution.application.service';
import { CosmwasmQueryService } from '../../models/cosmwasm/cosmwasm.query.service';
import { StoredWallet, WalletType } from '../../models/wallets/wallet.model';
import { WalletService } from '../../models/wallets/wallet.service';
import { YieldAggregatorQueryService } from '../../models/yield-aggregators/yield-aggregator.query.service';
import { throughMap } from '../../utils/pipes';
import { BalanceUsecaseService } from './balance.usecase.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { GetNodeInfo200Response } from '@cosmos-client/core/esm/openapi';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { StrategyAll200ResponseStrategiesInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
})
export class BalanceComponent implements OnInit {
  walletId$: Observable<string | null | undefined>;
  walletType$: Observable<WalletType | null | undefined>;
  accAddress$: Observable<string | null | undefined>;
  accountTypeName$: Observable<string | null | undefined>;
  publicKey$: Observable<string | null | undefined>;
  valAddress$: Observable<string | null | undefined>;
  symbolImageMap: { [symbol: string]: string };
  denomBalancesMap$: Observable<{ [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  denomMetadataMap$: Observable<{
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;

  faucetSymbols$: Observable<string[] | undefined>;
  faucets$: Observable<
    | {
        hasFaucet: boolean;
        faucetURL: string;
        denom: string;
        creditAmount: number;
        maxCredit: number;
      }[]
    | undefined
  >;
  nodeInfo$: Observable<GetNodeInfo200Response>;
  account$: Observable<
    | cosmosclient.proto.cosmos.auth.v1beta1.BaseAccount
    | cosmosclient.proto.cosmos.vesting.v1beta1.ContinuousVestingAccount
    | unknown
    | undefined
  >;

  // UYA unbonding
  strategies$: Observable<
    {
      strategy: StrategyAll200ResponseStrategiesInner;
      unbonding?: string;
    }[]
  >;
  strategySymbols$: Observable<{ symbol: string; display: string; img: string }[]>;
  usdUnbondingAmount$: Observable<number[]>;
  usdTotalUnbondingAmount$: Observable<number>;

  constructor(
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly rest: CosmosRestService,
    private usecase: BalanceUsecaseService,
    private readonly distributionAppService: DistributionApplicationService,
    private readonly wasmQuery: CosmwasmQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly bandProtocolService: BandProtocolService,
  ) {
    const wallet$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
    );
    const address$ = wallet$.pipe(map((wallet) => wallet.address));
    this.walletId$ = wallet$.pipe(map((wallet) => wallet.id));
    this.walletType$ = wallet$.pipe(map((wallet) => wallet.type));
    this.accAddress$ = wallet$.pipe(map((wallet) => wallet.address));
    this.publicKey$ = wallet$.pipe(map((wallet) => wallet.public_key));
    const cosmosWallet$ = wallet$.pipe(
      throughMap((storedWallet) =>
        this.walletService.convertStoredWalletToCosmosWallet(storedWallet),
      ),
    );
    this.valAddress$ = cosmosWallet$.pipe(
      throughMap((wallet) => wallet.address.toValAddress().toString()),
    );
    this.symbolImageMap = this.bankQuery.getSymbolImageMap();
    this.denomBalancesMap$ = address$.pipe(
      mergeMap((address) => this.bankQuery.getDenomBalanceMap$(address!)),
    );
    this.denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();

    this.faucets$ = this.usecase.faucets$;
    this.faucetSymbols$ = combineLatest([this.faucets$, this.denomMetadataMap$]).pipe(
      map(([faucets, denomMetadataMap]) =>
        faucets?.map((f) => denomMetadataMap?.[f.denom!].symbol || 'Invalid Token'),
      ),
    );
    this.nodeInfo$ = this.rest.getNodeInfo$();
    this.accountTypeName$ = this.usecase.accountTypeName$;
    this.account$ = address$.pipe(
      mergeMap((address) => {
        if (address === undefined) {
          return of(undefined);
        }
        return this.rest.getAccount$(address.toString());
      }),
      map((account) => {
        const { protoJSONToInstance, castProtoJSONOfProtoAny } = cosmosclient.codec;
        return account && protoJSONToInstance(castProtoJSONOfProtoAny(account));
      }),
    );

    const allStrategies$ = this.iyaQuery.listStrategies$();
    this.strategies$ = combineLatest([allStrategies$, this.accAddress$]).pipe(
      mergeMap(([strategies, address]) =>
        Promise.all(
          strategies.map(async (strategy) => {
            if (!strategy.strategy?.contract_address || !address) {
              return { strategy };
            }
            const unbonding = await this.wasmQuery.getUnbonding(
              strategy.strategy?.contract_address,
              address,
            );
            return { strategy, unbonding };
          }),
        ),
      ),
    );
    this.strategySymbols$ = combineLatest([this.strategies$, this.denomMetadataMap$]).pipe(
      map(([strategies, denomMetadataMap]) =>
        strategies.map((strategy) => {
          const symbol = strategy.strategy?.symbol || '';
          const display = denomMetadataMap?.[symbol]?.display || symbol;
          const img = this.bankQuery.getSymbolImageMap()[symbol];
          return { symbol: symbol, display: display, img: img };
        }),
      ),
    );
    this.usdUnbondingAmount$ = this.strategies$.pipe(
      mergeMap((strategies) =>
        Promise.all(
          strategies.map(async (strategy) =>
            this.bandProtocolService.convertToUSDAmount(
              strategy.strategy?.symbol || '',
              strategy.unbonding || '',
            ),
          ),
        ),
      ),
    );
    this.usdTotalUnbondingAmount$ = this.usdUnbondingAmount$.pipe(
      map((usdUnbondingAmount) => usdUnbondingAmount.reduce((a, b) => a + b, 0)),
    );
  }

  ngOnInit(): void {}

  onSubmitWithdrawAllDelegatorReward() {
    this.distributionAppService.openWithdrawAllDelegatorRewardFormDialog();
  }
}
