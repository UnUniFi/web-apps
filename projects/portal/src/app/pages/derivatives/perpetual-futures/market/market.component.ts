import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { DerivativesQueryService } from 'projects/portal/src/app/models/derivatives/derivatives.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { zip } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css'],
})
export class MarketComponent implements OnInit {
  baseSymbol$ = this.route.params.pipe(map((params) => params.baseSymbol));
  quoteSymbol$ = this.route.params.pipe(map((params) => params.quoteSymbol));

  address$ = this.walletService.currentStoredWallet$.pipe(
    filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
    map((wallet) => wallet.address),
  );

  params$ = this.derivativesQuery
    .getDerivativesParams$()
    .pipe(map((params) => params.perpetual_futures));

  symbolBalancesMap$ = this.address$.pipe(
    mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
  );
  symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();

  info$ = zip(this.baseSymbol$, this.quoteSymbol$, this.symbolMetadataMap$).pipe(
    mergeMap(([baseSymbol, quoteSymbol, symbolMetadataMap]) =>
      this.derivativesQuery.getPerpetualFuture$(
        symbolMetadataMap[baseSymbol].base!,
        symbolMetadataMap[quoteSymbol].base!,
      ),
    ),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly derivativesQuery: DerivativesQueryService,
  ) {}

  ngOnInit(): void {}

  onOpenPosition() {}
}
