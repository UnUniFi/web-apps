import { IncentiveApplicationService } from '../../models/incentives/incentive.application.service';
import { IncentiveQueryService } from '../../models/incentives/incentive.query.service';
import { StoredWallet } from '../../models/wallets/wallet.model';
import { WalletService } from '../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-incentive',
  templateUrl: './incentive.component.html',
  styleUrls: ['./incentive.component.css'],
})
export class IncentiveComponent implements OnInit {
  address$: Observable<string>;
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  unitIds$: Observable<string[] | undefined>;
  rewards$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(
    private readonly incentiveApp: IncentiveApplicationService,
    private readonly walletService: WalletService,
    private incentiveQuery: IncentiveQueryService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address)),
    );
    this.address$ = address$.pipe(map((addr) => addr.toString()));
    this.unitIds$ = address$.pipe(
      mergeMap((address) =>
        this.incentiveQuery.belongingRecipientContainerIdsByAddr$(address.toString()),
      ),
    );
    this.rewards$ = address$.pipe(
      mergeMap((address) => this.incentiveQuery.getAllRewards$(address.toString())),
    );
  }

  ngOnInit(): void {}

  onClickCreate(address: string) {
    this.incentiveApp.openCreateUnitFormDialog(address);
  }
  onClickReward(denom: string) {
    this.incentiveApp.openWithdrawIncentiveRewardFormDialog(denom);
  }
  onClickAllRewards(address: string) {
    this.incentiveApp.openWithdrawIncentiveAllRewardsFormDialog(address);
  }
}
