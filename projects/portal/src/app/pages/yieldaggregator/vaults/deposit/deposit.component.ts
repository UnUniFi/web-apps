import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BandProtocolService,
  TokenAmountUSD,
} from 'projects/portal/src/app/models/band-protocols/band-protocol.service';
import { getDenomExponent } from 'projects/portal/src/app/models/cosmos/bank.model';
import { BankQueryService } from 'projects/portal/src/app/models/cosmos/bank.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/yield-aggregators/yield-aggregator.query.service';
import { Observable, combineLatest } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

export type VaultBalance = {
  vaultId: string;
  amount: string;
};

@Component({
  selector: 'app-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
  address$: Observable<string>;
  owner$: Observable<string>;
  vaultBalances$: Observable<VaultBalance[]>;
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;
  symbols$: Observable<{ symbol: string; display: string; img: string }[]>;
  usdDepositAmount$: Observable<TokenAmountUSD[]>;
  usdTotalAmount$: Observable<number>;

  constructor(
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly bandProtocolService: BandProtocolService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.owner$ = this.route.params.pipe(map((params) => params.address));
    const balances$ = this.owner$.pipe(mergeMap((owner) => this.bankQuery.getBalance$(owner)));
    this.vaultBalances$ = balances$.pipe(
      map((balance) =>
        balance
          .filter((balance) => balance.denom?.includes('yieldaggregator/vaults/'))
          .map((balance) => {
            return {
              vaultId: balance.denom?.replace('yieldaggregator/vaults/', '')!,
              amount: balance.amount!,
            };
          }),
      ),
    );
    this.vaults$ = combineLatest([this.iyaQuery.listVaults$(), this.vaultBalances$]).pipe(
      map(([vaults, balances]) =>
        vaults.filter((vault) => balances.some((balance) => balance.vaultId === vault.vault?.id)),
      ),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbols$ = combineLatest([this.vaults$, denomMetadataMap$]).pipe(
      map(([vaults, denomMetadataMap]) =>
        vaults.map((vault) => {
          const symbol = denomMetadataMap?.[vault.vault?.denom!]?.symbol || '';
          const display = denomMetadataMap?.[vault.vault?.denom!]?.display || vault.vault?.denom!;
          const img = this.bankQuery.getSymbolImageMap()[symbol] || '';
          return { symbol: symbol, display: display, img: img };
        }),
      ),
    );
    this.usdDepositAmount$ = combineLatest([this.vaultBalances$, denomMetadataMap$]).pipe(
      mergeMap(([vaultBalances, denomMetadataMap]) =>
        Promise.all(
          vaultBalances.map(async (balance) => {
            const redeemAmount = await this.iyaQuery.getEstimatedRedeemAmount(
              balance.vaultId,
              balance.amount,
            );
            return this.bandProtocolService.convertToUSDAmountDenom(
              redeemAmount.redeem_amount?.denom!,
              redeemAmount.redeem_amount?.amount!,
              denomMetadataMap,
            );
          }),
        ),
      ),
    );
    this.usdTotalAmount$ = this.usdDepositAmount$.pipe(
      map((usdDepositAmount) => usdDepositAmount.reduce((a, b) => a + b.usdAmount, 0)),
    );
  }

  ngOnInit(): void {}
}
