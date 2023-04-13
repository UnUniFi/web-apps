import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { CopyTradingApplicationService } from 'projects/portal/src/app/models/copy-trading/copy-trading.application.service';
import {
  CreateExemplaryTraderRequest,
  UpdateExemplaryTraderRequest,
} from 'projects/portal/src/app/models/copy-trading/copy-trading.model';
import { CopyTradingQueryService } from 'projects/portal/src/app/models/copy-trading/copy-trading.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { Observable, combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ExemplaryTraderAll200ResponseExemplaryTraderInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  address$: Observable<string>;
  myExemplaryTrader$: Observable<ExemplaryTraderAll200ResponseExemplaryTraderInner | undefined>;
  traderName$: Observable<string | undefined>;
  traderDescription$: Observable<string | undefined>;
  commissionRate$: Observable<number | undefined>;

  constructor(
    private readonly walletService: WalletService,
    private readonly copyTradingQuery: CopyTradingQueryService,
    private readonly copyTradingApplication: CopyTradingApplicationService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );
    const exemplaryTraders$ = this.copyTradingQuery.listExemplaryTraders$();
    this.myExemplaryTrader$ = combineLatest([this.address$, exemplaryTraders$]).pipe(
      map(([address, traders]) => traders.find((trader) => trader.address == address)),
    );
    this.traderName$ = this.myExemplaryTrader$.pipe(map((trader) => trader?.name));
    this.traderDescription$ = this.myExemplaryTrader$.pipe(map((trader) => trader?.description));
    this.commissionRate$ = this.myExemplaryTrader$.pipe(
      map((trader) => Number(trader?.profit_commission_rate)),
    );
  }

  ngOnInit(): void {}

  onCreateTrader(data: CreateExemplaryTraderRequest) {
    this.copyTradingApplication.createExemplaryTrader(
      data.name,
      data.description,
      data.profitCommissionRate,
    );
  }

  onUpdateTrader(data: UpdateExemplaryTraderRequest) {
    this.copyTradingApplication.updateExemplaryTrader(
      data.name,
      data.description,
      data.profitCommissionRate,
    );
  }
}
