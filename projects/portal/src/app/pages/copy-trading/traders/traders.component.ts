import { CopyTradingQueryService } from '../../../models/copy-trading/copy-trading.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  ExemplaryTraderAll200ResponseExemplaryTraderInner,
  ExemplaryTraderTracing200ResponseTracingInner,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-traders',
  templateUrl: './traders.component.html',
  styleUrls: ['./traders.component.css'],
})
export class TradersComponent implements OnInit {
  address$: Observable<string>;
  exemplaryTraders$: Observable<ExemplaryTraderAll200ResponseExemplaryTraderInner[]>;
  tracing$: Observable<ExemplaryTraderTracing200ResponseTracingInner>;
  tracingTrader$: Observable<ExemplaryTraderAll200ResponseExemplaryTraderInner | undefined>;
  userCounts$: Observable<number[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly copyTradingQuery: CopyTradingQueryService,
  ) {
    const currentStoredWallet$ = this.walletService.currentStoredWallet$;
    this.address$ = currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => cosmosclient.AccAddress.fromString(wallet.address).toString()),
    );
    this.exemplaryTraders$ = this.copyTradingQuery.listExemplaryTraders$();
    this.tracing$ = this.address$.pipe(
      mergeMap((address) => this.copyTradingQuery.getTracing$(address)),
    );
    this.tracingTrader$ = combineLatest([this.tracing$, this.exemplaryTraders$]).pipe(
      map(([tracing, traders]) =>
        traders.find((trader) => trader.address == tracing.exemplary_trader),
      ),
    );

    const availableTracings$ = this.copyTradingQuery.listAllTracings$();
    this.userCounts$ = combineLatest([this.exemplaryTraders$, availableTracings$]).pipe(
      map(([traders, tracings]) =>
        traders.map(
          (trader) =>
            tracings.filter((tracing) => tracing.exemplary_trader == trader.address).length,
        ),
      ),
    );
  }

  ngOnInit(): void {}

  onDeleteTracing() {}
}
