import { BankApplicationService } from '../../../models/cosmos/bank.application.service';
import { BankSendRequest } from '../../../models/cosmos/bank.model';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  address$: Observable<string>;
  toAddress$: Observable<string>;
  selectedTokens$: Observable<{ symbol: string; amount?: number }[]>;
  balanceSymbols$: Observable<({ symbol: string; display: string } | undefined)[]>;
  symbolBalancesMap$: Observable<{ [symbol: string]: number }>;
  symbolImageMap: { [symbol: string]: string };

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly bankApp: BankApplicationService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.toAddress$ = this.route.queryParams.pipe(map((queryParams) => queryParams.toAddress));
    this.selectedTokens$ = this.route.queryParams.pipe(
      map((queryParams) => queryParams.amounts || []),
    );
    this.symbolBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address!)),
    );
    this.symbolImageMap = this.bankQuery.getSymbolImageMap();
    const balance$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getBalance$(address!)),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();

    this.balanceSymbols$ = combineLatest([balance$, denomMetadataMap$]).pipe(
      map(([balances, denomMetadataMap]) =>
        balances?.map((b) => {
          const denomMetadata = denomMetadataMap?.[b.denom || ''];
          if (denomMetadata) {
            return {
              symbol: denomMetadata.symbol!,
              display: denomMetadata.display!,
            };
          } else {
            return undefined;
          }
        }),
      ),
    );
  }

  ngOnInit(): void {}

  onSubmitSend(data: BankSendRequest) {
    this.bankApp.bankSend(data.toAddress, data.symbolAmounts);
  }
}
