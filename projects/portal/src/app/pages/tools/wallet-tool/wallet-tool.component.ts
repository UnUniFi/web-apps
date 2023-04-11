import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { WalletApplicationService } from '../../../models/wallets/wallet.application.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-wallet-tool',
  templateUrl: './wallet-tool.component.html',
  styleUrls: ['./wallet-tool.component.css'],
})
export class WalletToolComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  symbolBalancesMap$: Observable<{ [symbol: string]: number }>;

  constructor(
    private readonly walletService: WalletService,
    private readonly walletApplicationService: WalletApplicationService,
    private readonly bankQuery: BankQueryService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.symbolBalancesMap$ = address$.pipe(
      mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
    );
    this.currentStoredWallet$.subscribe((wallet) => {
      console.log('wallet', wallet);
    });
    this.symbolBalancesMap$.subscribe((symbolBalancesMap) => {
      console.log('symbolBalancesMap', symbolBalancesMap);
    });
  }

  ngOnInit(): void {}

  // WIP
  async onConnectWallet($event: {}) {
    await this.walletApplicationService.connectWalletDialog();
  }

  async onDisconnectWallet($event: {}) {
    await this.walletApplicationService.disconnectWallet();
  }
}
