import { BandProtocolService } from '../../../models/band-protocols/band-protocol.service';
import { IRSVaultImage, ConfigService } from '../../../models/config.service';
import { getDenomExponent } from '../../../models/cosmos/bank.model';
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
  vaultsMaxFixedAPYs$: Observable<number[] | undefined>;
  vaultsImages$: Observable<IRSVaultImage[]>;
  denomBalancesMap$: Observable<{ [symbol: string]: cosmosclient.proto.cosmos.base.v1beta1.ICoin }>;
  ptValues$: Observable<number[] | undefined>;
  totalPositionValue$: Observable<number | undefined>;
  maturedPtValue$: Observable<number | undefined>;

  constructor(
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly irsQuery: IrsQueryService,
    private readonly configS: ConfigService,
    private readonly bandProtocolService: BandProtocolService,
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
          tranches
            ? tranches.map(async (tranche) =>
                tranche.id
                  ? await this.irsQuery.getTranchePtAPYs(tranche.id).then((apy) => {
                      return { ...apy, strategy_contract: tranche.strategy_contract };
                    })
                  : undefined,
              )
            : [],
        ),
      ),
    );
    this.vaultsMaxFixedAPYs$ = combineLatest([this.vaults$, trancheFixedAPYs$]).pipe(
      map(([vaults, apys]) =>
        vaults?.map((vault) => {
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
        vaults?.map((vault) => {
          const fixedAPYs = apys.filter(
            (apy) => apy?.strategy_contract === vault.strategy_contract,
          );
          const vaultTranches = tranches?.filter(
            (tranche) => tranche.strategy_contract === vault.strategy_contract,
          );
          const trancheBalances = vaultTranches?.map(
            (tranche) =>
              denomBalancesMap[`irs/tranche/${tranche.id}/pt`] || {
                amount: '0',
                denom: `irs/tranche/${tranche.id}/pt`,
              },
          );
          let value = 0;
          if (!trancheBalances?.length) {
            return value;
          }
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

    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    const symbols$ = combineLatest([this.vaults$, denomMetadataMap$]).pipe(
      map(([vaults, metadata]) =>
        vaults?.map((pool) => metadata[pool.deposit_denom || '']?.symbol),
      ),
    );
    const prices$ = symbols$.pipe(
      mergeMap((symbols) =>
        Promise.all(
          symbols
            ? symbols.map(async (symbol) => {
                if (!symbol) {
                  return { symbol: '', price: 0 };
                }
                if (symbol.includes('st')) {
                  symbol = symbol.replace('st', '');
                }
                return { symbol, price: await this.bandProtocolService.getPrice(symbol) };
              })
            : [],
        ),
      ),
    );
    this.totalPositionValue$ = combineLatest([this.vaults$, this.ptValues$, prices$]).pipe(
      map(([vaults, ptValues, prices]) => {
        let totalValue = 0;
        if (!vaults) {
          return totalValue;
        }
        for (let i = 0; i < vaults.length; i++) {
          const ptValue =
            (ptValues?.[i] || 0) / Math.pow(10, getDenomExponent(vaults[i].deposit_denom));
          const price = prices?.[i] || 0;
          totalValue += ptValue * (price.price || 0);
        }
        return totalValue;
      }),
    );
    const maturedPools$ = this.tranchePools$.pipe(
      map((tranches) =>
        tranches?.filter(
          (tranche) => (Number(tranche.maturity) + Number(tranche.start_time)) * 1000 < Date.now(),
        ),
      ),
    );
    this.maturedPtValue$ = combineLatest([
      maturedPools$,
      this.denomBalancesMap$,
      denomMetadataMap$,
      prices$,
    ]).pipe(
      map(([tranches, denomBalancesMap, metadata, prices]) => {
        let totalValue = 0;
        if (!tranches) {
          return totalValue;
        }
        for (const tranche of tranches) {
          const symbol = metadata[tranche.deposit_denom || '']?.symbol;
          const price = prices?.find((p) => p.symbol === symbol);
          const uptAmount = denomBalancesMap[`irs/tranche/${tranche.id}/pt`];
          const ptAmount =
            Number(uptAmount.amount) / Math.pow(10, getDenomExponent(tranche.deposit_denom));
          if (ptAmount && price?.price) {
            totalValue += ptAmount * price.price;
          }
        }
        return totalValue;
      }),
    );
  }

  ngOnInit(): void {}
}
