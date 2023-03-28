import { BankQueryService } from '../../models/cosmos/bank.query.service';
import { DistributionApplicationService } from '../../models/cosmos/distribution.application.service';
import { StoredWallet, WalletType } from '../../models/wallets/wallet.model';
import { WalletService } from '../../models/wallets/wallet.service';
import { BalanceUsecaseService } from './balance.usecase.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  GetNodeInfo200Response,
} from '@cosmos-client/core/esm/openapi';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

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
  balances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[] | null | undefined>;
  balanceSymbols$: Observable<string[] | undefined>;
  rewards$: Observable<
    CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse | null | undefined
  >;
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
  faucetSymbols$: Observable<string[] | undefined>;
  nodeInfo$: Observable<GetNodeInfo200Response>;
  symbolBalancesMap$: Observable<{ [symbol: string]: number }>;

  constructor(
    private usecase: BalanceUsecaseService,
    private readonly distributionAppService: DistributionApplicationService,
    private readonly bankQuery: BankQueryService,
    private readonly walletService: WalletService,
  ) {
    const address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.walletId$ = this.usecase.walletId$;
    this.walletType$ = this.usecase.walletType$;
    this.accAddress$ = this.usecase.accAddress$;
    this.publicKey$ = this.usecase.publicKey$;
    this.valAddress$ = this.usecase.valAddress$;
    this.balances$ = this.usecase.balances$;
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.balanceSymbols$ = combineLatest([this.balances$, denomMetadataMap$]).pipe(
      map(([balances, denomMetadataMap]) =>
        balances?.map((b) => denomMetadataMap?.[b.denom!].symbol || 'Invalid Token'),
      ),
    );
    this.rewards$ = this.usecase.rewards$;
    this.faucets$ = this.usecase.faucets$;
    this.faucetSymbols$ = combineLatest([this.faucets$, denomMetadataMap$]).pipe(
      map(([faucets, denomMetadataMap]) =>
        faucets?.map((f) => denomMetadataMap?.[f.denom!].symbol || 'Invalid Token'),
      ),
    );
    this.nodeInfo$ = this.usecase.nodeInfo$;
    this.accountTypeName$ = this.usecase.accountTypeName$;
    this.symbolBalancesMap$ = address$.pipe(
      mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address!)),
    );
    this.symbolBalancesMap$.subscribe((a) => console.log(a));
  }

  ngOnInit(): void {}

  onSubmitWithdrawAllDelegatorReward() {
    this.distributionAppService.openWithdrawAllDelegatorRewardFormDialog();
  }
}
