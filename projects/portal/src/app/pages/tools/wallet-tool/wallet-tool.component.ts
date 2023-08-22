import { ConfigService } from '../../../models/config.service';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { KeplrService } from '../../../models/wallets/keplr/keplr.service';
import { LeapService } from '../../../models/wallets/leap/leap.service';
import { WalletApplicationService } from '../../../models/wallets/wallet.application.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable, combineLatest, from } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-wallet-tool',
  templateUrl: './wallet-tool.component.html',
  styleUrls: ['./wallet-tool.component.css'],
})
export class WalletToolComponent implements OnInit {
  currentStoredWallet$: Observable<StoredWallet | null | undefined>;
  symbol$: Observable<string | null | undefined>;
  symbolBalancesMap$: Observable<{ [symbol: string]: number }>;
  symbolMetadataMap$: Observable<{
    [symbol: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;
  keplrStoredWallet$: Observable<StoredWallet | null | undefined>;
  leapStoredWallet$: Observable<StoredWallet | null | undefined>;

  constructor(
    private readonly walletService: WalletService,
    private readonly walletApplicationService: WalletApplicationService,
    private readonly bankQuery: BankQueryService,
    private readonly keplrService: KeplrService,
    private readonly leapService: LeapService,
    private readonly configService: ConfigService,
  ) {
    this.currentStoredWallet$ = this.walletService.currentStoredWallet$;
    const address$ = this.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    const denom$ = this.configService.config$.pipe(
      map((config) => config?.minimumGasPrices?.[0]?.denom),
    );
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    this.symbol$ = combineLatest([denom$, denomMetadataMap$]).pipe(
      map(([denom, metadata]) => metadata[denom || ''].symbol),
    );
    this.symbolBalancesMap$ = address$.pipe(
      mergeMap((address) => this.bankQuery.getSymbolBalanceMap$(address)),
    );
    this.keplrStoredWallet$ = from(this.keplrService.checkWallet());
    this.leapStoredWallet$ = from(this.leapService.checkWallet());
  }

  ngOnInit(): void {}

  async onConnectWallet($event: {}) {
    await this.walletApplicationService.connectWalletDialog();
  }

  async onDisconnectWallet($event: {}) {
    await this.walletApplicationService.disconnectWallet();
  }
}
