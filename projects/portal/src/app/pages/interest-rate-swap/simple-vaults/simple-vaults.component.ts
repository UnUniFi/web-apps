import { IRSVaultImage, ConfigService } from '../../../models/config.service';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { dummyVaults, dummyVaultsMaxAPYs } from '../../../models/irs/irs.dummy';
import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable, combineLatest, of } from 'rxjs';
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
  vaultsMaxFixedAPYs$: Observable<number[]>;
  vaultsImages$: Observable<IRSVaultImage[]>;

  constructor(
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly irsQuery: IrsQueryService,
    private readonly configS: ConfigService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    const balances$ = this.address$.pipe(mergeMap((addr) => this.bankQuery.getBalance$(addr)));
    this.vaultBalances$ = balances$.pipe(
      map((balance) => balance.filter((balance) => balance.denom?.includes('irs/tranche/'))),
    );
    const trancheFixedAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id
              ? await this.irsQuery
                  .getTranchePtAPYs$(tranche.id)
                  .toPromise()
                  .then((apy) => {
                    return { ...apy, strategy_contract: tranche.strategy_contract };
                  })
              : undefined,
          ),
        ),
      ),
    );
    this.vaultsMaxFixedAPYs$ = combineLatest([this.vaults$, trancheFixedAPYs$]).pipe(
      map(([vaults, apys]) =>
        vaults.map((vault) => {
          const fixedAPYs = apys.filter(
            (apy) => apy?.strategy_contract === vault.strategy_contract,
          );
          return fixedAPYs.reduce((prev, curr) => Math.max(Number(curr?.pt_apy), prev), 0);
        }),
      ),
    );
    this.vaultsImages$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.vaults$ = of(dummyVaults);
    this.vaultsMaxFixedAPYs$ = of(dummyVaultsMaxAPYs);
  }

  ngOnInit(): void {}
}
