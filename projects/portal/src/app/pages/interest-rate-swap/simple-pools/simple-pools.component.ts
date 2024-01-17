import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { dummyExtendedVaults, dummyTranchePools, dummyVaults } from '../../../models/irs/irs.dummy';
import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable, combineLatest, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import {
  TranchePoolAPYs200Response,
  VaultByContract200ResponseVault,
} from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-simple-pools',
  templateUrl: './simple-pools.component.html',
  styleUrls: ['./simple-pools.component.css'],
})
export class SimplePoolsComponent implements OnInit {
  address$: Observable<string>;
  vaults$ = this.irsQuery.listVaults$();
  tranchePools$ = this.irsQuery.listAllTranches$();
  extendedVaults$: Observable<
    (VaultByContract200ResponseVault & { denom?: string; maxAPY: number })[]
  >;
  lpBalances$: Observable<cosmosclient.proto.cosmos.base.v1beta1.ICoin[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly irsQuery: IrsQueryService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );

    this.extendedVaults$ = combineLatest([this.vaults$, this.tranchePools$]).pipe(
      mergeMap(([vaults, pools]) =>
        Promise.all(
          vaults.map(async (vault) => {
            const contractPools = pools.filter(
              (pool) => pool.strategy_contract === vault.strategy_contract,
            );
            let maxAPY = 0;
            let denom: string | undefined;
            for (const pool of contractPools) {
              if (pool.id) {
                const apys = await this.irsQuery.getTranchePoolAPYs$(pool.id).toPromise();
                if (Number(apys.liquidity_apy) > maxAPY) {
                  maxAPY = Number(apys.liquidity_apy);
                }
              }
              if (pool.pool_assets) {
                for (const asset of pool.pool_assets) {
                  if (!asset.denom?.includes('irs/tranche/')) {
                    denom = asset.denom;
                  }
                }
              }
            }
            return {
              ...vault,
              denom,
              maxAPY,
            };
          }),
        ),
      ),
    );
    const balances$ = this.address$.pipe(mergeMap((addr) => this.bankQuery.getBalance$(addr)));
    this.lpBalances$ = balances$.pipe(
      map((balance) => balance.filter((balance) => balance.denom?.includes('/ls'))),
    );
    this.vaults$ = of(dummyVaults);
    this.tranchePools$ = of(dummyTranchePools);
    this.extendedVaults$ = of(dummyExtendedVaults);
  }

  ngOnInit(): void {}
}
