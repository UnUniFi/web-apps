import { BankApplicationService } from '../../../models/cosmos/bank.application.service';
import { BankSendRequest } from '../../../models/cosmos/bank.model';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import cosmosclient from '@cosmos-client/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.css'],
})
export class SendComponent implements OnInit {
  address$: Observable<string>;
  toAddress$: Observable<string>;
  selectedTokens$: Observable<{ denom: string; amount?: number }[]>;
  denomBalancesMap$: Observable<{ [denom: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  symbolImageMap: { [symbol: string]: string };
  denomMetadataMap$: Observable<{
    [denom: string]: cosmosclient.proto.cosmos.bank.v1beta1.IMetadata;
  }>;

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
    this.denomBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getDenomBalanceMap$(address!)),
    );
    this.symbolImageMap = this.bankQuery.getSymbolImageMap();

    this.denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
  }

  ngOnInit(): void {}

  onSubmitSend(data: BankSendRequest) {
    this.bankApp.bankSend(data.toAddress, data.denomReadableAmountMap);
  }
}
