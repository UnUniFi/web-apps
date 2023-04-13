import { CopyTradingQueryService } from '../../../../models/copy-trading/copy-trading.query.service';
import { StoredWallet } from '../../../../models/wallets/wallet.model';
import { WalletService } from '../../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { CopyTradingApplicationService } from 'projects/portal/src/app/models/copy-trading/copy-trading.application.service';
import {
  CreateTracingRequest,
  UpdateExemplaryTraderRequest,
} from 'projects/portal/src/app/models/copy-trading/copy-trading.model';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  ExemplaryTraderAll200ResponseExemplaryTraderInner,
  ExemplaryTraderTracing200ResponseTracingInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-trader',
  templateUrl: './trader.component.html',
  styleUrls: ['./trader.component.css'],
})
export class TraderComponent implements OnInit {
  address$: Observable<string>;
  exemplaryTraderAddress$: Observable<string>;
  trader$: Observable<ExemplaryTraderAll200ResponseExemplaryTraderInner>;
  tracing$: Observable<ExemplaryTraderTracing200ResponseTracingInner>;
  isTracing$: Observable<boolean>;
  userCount$: Observable<number>;
  commissionRate$: Observable<number>;
  description$: Observable<string | undefined>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly copyTradingQuery: CopyTradingQueryService,
    private readonly copyTradingApplication: CopyTradingApplicationService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );
    this.exemplaryTraderAddress$ = this.route.params.pipe(map((params) => params.address));
    this.trader$ = this.exemplaryTraderAddress$.pipe(
      mergeMap((exAddress) => this.copyTradingQuery.getExemplaryTrader$(exAddress)),
    );
    this.tracing$ = this.address$.pipe(
      mergeMap((address) => this.copyTradingQuery.getTracing$(address)),
    );
    this.isTracing$ = combineLatest([this.tracing$, this.exemplaryTraderAddress$]).pipe(
      map(([tracing, exAddress]) => tracing.exemplary_trader == exAddress),
    );
    this.userCount$ = combineLatest([
      this.exemplaryTraderAddress$,
      this.copyTradingQuery.listAllTracings$(),
    ]).pipe(
      map(
        ([exAddress, tracings]) =>
          tracings.filter((tracing) => tracing.exemplary_trader == exAddress).length,
      ),
    );
    this.commissionRate$ = this.trader$.pipe(
      map((trader) => Number(trader.profit_commission_rate || 0)),
    );
    this.description$ = this.trader$.pipe(map((trader) => trader.description));
  }

  ngOnInit(): void {}

  onCreateTracing(data: CreateTracingRequest) {
    this.copyTradingApplication.createTracing(
      data.exemplaryTrader,
      data.sizeCoef,
      data.leverageCoef,
      data.reverse,
    );
  }

  onDeleteTracing() {
    this.copyTradingApplication.deleteTracing();
  }

  onUpdateTrader(data: UpdateExemplaryTraderRequest) {
    this.copyTradingApplication.updateExemplaryTrader(
      data.name,
      data.description,
      data.profitCommissionRate,
    );
  }

  onDeleteTrader() {
    this.copyTradingApplication.deleteExemplaryTrader();
  }
}
