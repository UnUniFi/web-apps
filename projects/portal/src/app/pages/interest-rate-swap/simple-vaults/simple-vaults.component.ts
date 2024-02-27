import { IRSVaultImage, ConfigService } from '../../../models/config.service';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { IrsQueryService } from '../../../models/irs/irs.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { Component, OnInit } from '@angular/core';
import cosmosclient from '@cosmos-client/core';
import { Observable, combineLatest } from 'rxjs';
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
  vaultsMaxFixedAPYs$: Observable<number[]>;
  vaultsImages$: Observable<IRSVaultImage[]>;
  denomBalancesMap$: Observable<{ [symbol: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  ptValues$: Observable<number[]>;

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
    this.denomBalancesMap$ = this.address$.pipe(
      mergeMap((address) => this.bankQuery.getDenomBalanceMap$(address)),
    );
    const trancheFixedAPYs$ = this.tranchePools$.pipe(
      mergeMap((tranches) =>
        Promise.all(
          tranches.map(async (tranche) =>
            tranche.id
              ? await this.irsQuery.getTranchePtAPYs(tranche.id).then((apy) => {
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
          return fixedAPYs.reduce((prev, curr) => Math.max(Number(curr?.pt_apy || 0), prev), 0);
        }),
      ),
    );
    this.vaultsImages$ = this.configS.config$.pipe(map((config) => config?.irsVaultsImages ?? []));
    this.ptValues$ = combineLatest([
      this.vaults$,
      this.tranchePools$,
      trancheFixedAPYs$,
      this.denomBalancesMap$,
    ]).pipe(
      map(([vaults, tranches, apys, denomBalancesMap]) =>
        vaults.map((vault) => {
          const fixedAPYs = apys.filter(
            (apy) => apy?.strategy_contract === vault.strategy_contract,
          );
          const vaultTranches = tranches.filter(
            (tranche) => tranche.strategy_contract === vault.strategy_contract,
          );
          const trancheBalances = vaultTranches.map(
            (tranche) =>
              denomBalancesMap[`irs/tranche/${tranche.id}/pt`] || {
                amount: '0',
                denom: `irs/tranche/${tranche.id}/pt`,
              },
          );
          let value = 0;
          for (let i = 0; i < trancheBalances.length; i++) {
            if (trancheBalances[i] && fixedAPYs[i]) {
              if (fixedAPYs[i]?.pt_rate_per_deposit) {
                value +=
                  Number(trancheBalances[i].amount) / Number(fixedAPYs[i]?.pt_rate_per_deposit);
              }
            }
          }
          return Math.floor(value);
        }),
      ),
    );
  }

  ngOnInit(): void {}
}
