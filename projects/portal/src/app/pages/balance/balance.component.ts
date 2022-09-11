import { DistributionApplicationService } from '../../models/cosmos/distribution.application.service';
import { WalletType } from '../../models/wallets/wallet.model';
import { BalanceUsecaseService } from './balance.usecase.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import {
  CosmosDistributionV1beta1QueryDelegationTotalRewardsResponse,
  InlineResponse20012,
} from '@cosmos-client/core/esm/openapi';
import { Observable } from 'rxjs';

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
  nodeInfo$: Observable<InlineResponse20012>;

  constructor(
    private usecase: BalanceUsecaseService,
    private readonly distributionAppService: DistributionApplicationService,
  ) {
    this.walletId$ = this.usecase.walletId$;
    this.walletType$ = this.usecase.walletType$;
    this.accAddress$ = this.usecase.accAddress$;
    this.publicKey$ = this.usecase.publicKey$;
    this.valAddress$ = this.usecase.valAddress$;
    this.balances$ = this.usecase.balances$;
    this.rewards$ = this.usecase.rewards$;
    this.faucets$ = this.usecase.faucets$;
    this.nodeInfo$ = this.usecase.nodeInfo$;
    this.accountTypeName$ = this.usecase.accountTypeName$;
  }

  ngOnInit(): void {}

  onSubmitWithdrawAllDelegatorReward() {
    this.distributionAppService.openWithdrawAllDelegatorRewardFormDialog();
  }
}
