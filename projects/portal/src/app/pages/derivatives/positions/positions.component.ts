import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { DerivativesApplicationService } from '../../../models/derivatives/derivatives.application.service';
import { DerivativesQueryService } from '../../../models/derivatives/derivatives.query.service';
import { PricefeedQueryService } from '../../../models/pricefeeds/pricefeed.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { ClosePositionEvent } from '../../../views/derivatives/positions/positions.component';
import { Component, OnInit } from '@angular/core';
import { combineLatest, timer } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css'],
})
export class PositionsComponent implements OnInit {
  address$ = this.walletService.currentStoredWallet$.pipe(
    filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
    map((wallet) => wallet.address),
  );
  timer$ = timer(0, 1000 * 60);
  positions$ = combineLatest([this.address$, this.timer$]).pipe(
    mergeMap(([address, _]) => this.derivativesQuery.listAddressPositions$(address)),
  );
  denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
  prices$ = this.timer$.pipe(mergeMap((_) => this.pricefeedQuery.listAllPrices$()));

  markets$ = this.pricefeedQuery.listAllMarkets$();
  longPositionsTotal$ = combineLatest([this.address$, this.timer$]).pipe(
    mergeMap(([address, _]) =>
      this.derivativesQuery.getPerpetualFuturesPositionsTotal('LONG', address),
    ),
  );
  shortPositionsTotal$ = combineLatest([this.address$, this.timer$]).pipe(
    mergeMap(([address, _]) =>
      this.derivativesQuery.getPerpetualFuturesPositionsTotal('SHORT', address),
    ),
  );

  constructor(
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly pricefeedQuery: PricefeedQueryService,
    private readonly derivativesQuery: DerivativesQueryService,
    private readonly derivativesApplication: DerivativesApplicationService,
  ) {}

  ngOnInit(): void {}

  async onClosePosition($event: ClosePositionEvent) {
    await this.derivativesApplication.closePosition($event.positionId);
  }
}
