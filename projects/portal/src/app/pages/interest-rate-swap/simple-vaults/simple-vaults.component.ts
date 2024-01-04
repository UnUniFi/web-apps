import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-simple-vaults',
  templateUrl: './simple-vaults.component.html',
  styleUrls: ['./simple-vaults.component.css'],
})
export class SimpleVaultsComponent implements OnInit {
  address$: Observable<string>;
  vaults$ = this.irsQuery.listVaults$();
  tranchePools$ = this.irsQuery.listAllTranches$();
  vaultBalances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly irsQuery: IrsQueryService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    const balances$ = this.address$.pipe(mergeMap((addr) => this.bankQuery.getBalance$(addr)));
    this.vaultBalances$ = balances$.pipe(
      map((balance) => balance.filter((balance) => balance.denom?.includes('irs/tranche/'))),
    );
  }

  ngOnInit(): void {}
}
