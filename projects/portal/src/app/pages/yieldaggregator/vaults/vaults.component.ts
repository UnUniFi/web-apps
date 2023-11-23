import { BandProtocolService } from '../../../models/band-protocols/band-protocol.service';
import { ConfigService } from '../../../models/config.service';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { VaultInfo } from '../../../models/yield-aggregators/yield-aggregator.model';
import { YieldAggregatorQueryService } from '../../../models/yield-aggregators/yield-aggregator.query.service';
import { YieldAggregatorService } from '../../../models/yield-aggregators/yield-aggregator.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map, mergeMap, switchMap } from 'rxjs/operators';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
})
export class VaultsComponent implements OnInit {
  address$: Observable<string>;
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;
  symbols$: Observable<{ symbol: string; display: string; img: string }[]>;
  vaultsInfo$: Observable<VaultInfo[]>;
  totalDeposits$: Observable<number[]>;
  keyword$: Observable<string>;
  sortType$: BehaviorSubject<string> = new BehaviorSubject<string>('id');
  certified$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaService: YieldAggregatorService,
    private readonly configService: ConfigService,
    private readonly bandProtocolService: BandProtocolService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    const vaults$ = this.iyaQuery.listVaults$();
    const config$ = this.configService.config$;
    this.keyword$ = this.route.queryParams.pipe(map((params) => params.keyword));
    const symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    const vaultYieldMap$ = combineLatest([vaults$, config$]).pipe(
      switchMap(async ([vaults, config]) => {
        const results: VaultInfo[] = [];
        if (!config) {
          return results;
        }
        for (const vault of vaults) {
          const result = await this.iyaService.calcVaultAPY(vault, config);
          results.push(result);
        }
        return results;
      }),
      map((yields) => {
        const yieldMap: { [id: string]: VaultInfo } = {};
        for (const y of yields) {
          yieldMap[y.id] = y;
        }
        return yieldMap;
      }),
    );

    const availableSymbols$ = vaults$.pipe(
      map((vaults) => {
        const symbols = vaults
          .map((vault) => vault.vault?.symbol)
          .filter((symbol): symbol is string => !!symbol);
        return [...new Set(symbols)];
      }),
    );
    const symbolPriceMap$ = availableSymbols$.pipe(
      mergeMap((symbols) => {
        const symbolPriceMap: { [symbol: string]: number } = {};
        return Promise.all(
          symbols.map(async (symbol) => {
            const price = await this.bandProtocolService.getPrice(symbol);
            symbolPriceMap[symbol] = price || 0;
          }),
        ).then(() => symbolPriceMap);
      }),
    );

    const certifiedVaults$ = combineLatest([vaults$, config$, this.certified$.asObservable()]).pipe(
      map(([vaults, config, certified]) => {
        if (certified) {
          return (
            config?.certifiedVaults
              ?.map((id) => vaults.find((vault) => vault.vault?.id === id))
              .filter((vault): vault is VaultAll200ResponseVaultsInner => vault !== undefined) || []
          );
        } else {
          return vaults;
        }
      }),
    );
    const searchedVaults$ = combineLatest([certifiedVaults$, this.keyword$]).pipe(
      map(([vaults, keyword]) => {
        if (keyword) {
          return vaults.filter((vault) => {
            const hasIdMatch = vault.vault?.id && vault.vault?.id.includes(keyword);
            const hasOwnerMatch = vault.vault?.owner?.includes(keyword);
            const hasSymbolMatch = vault.vault?.symbol?.includes(keyword);
            return hasIdMatch || hasOwnerMatch || hasSymbolMatch;
          });
        } else {
          return vaults;
        }
      }),
    );
    const sortedVaults$ = combineLatest([
      searchedVaults$,
      this.sortType$,
      vaultYieldMap$,
      symbolPriceMap$,
    ]).pipe(
      map(([vaults, sort, yieldMap, symbolPriceMap]) => {
        if (sort === 'id') {
          return vaults.sort((a, b) => Number(a.vault?.id) - Number(b.vault?.id));
        }
        if (sort === 'name') {
          return vaults.sort((a, b) => {
            const nameA = a.vault?.name;
            const nameB = b.vault?.name;
            if (!nameA || !nameB) {
              if (nameA) {
                return -1;
              }
              if (nameB) {
                return 1;
              }
              return 0;
            } else {
              return nameA.localeCompare(nameB);
            }
          });
        }
        if (sort === 'apy') {
          return vaults.sort((a, b) => {
            const aYield = yieldMap[a.vault?.id || ''];
            const bYield = yieldMap[b.vault?.id || ''];
            return (bYield?.minApy || 0) - (aYield?.minApy || 0);
          });
        }
        if (sort === 'commission') {
          return vaults.sort(
            (a, b) =>
              Number(a.vault?.withdraw_commission_rate) - Number(b.vault?.withdraw_commission_rate),
          );
        }
        if (sort === 'deposit') {
          return vaults.sort((a, b) => {
            const aDeposit = this.bandProtocolService.calcUSDAmount(
              a.vault?.symbol || '',
              this.depositAmount(a),
              symbolPriceMap,
            );
            const bDeposit = this.bandProtocolService.calcUSDAmount(
              b.vault?.symbol || '',
              this.depositAmount(b),
              symbolPriceMap,
            );
            return (bDeposit || 0) - (aDeposit || 0);
          });
        }
        return vaults;
      }),
    );
    this.vaults$ = sortedVaults$;
    this.vaultsInfo$ = combineLatest([this.vaults$, vaultYieldMap$]).pipe(
      map(([vaults, map]) =>
        vaults.map(
          (vault) =>
            map[vault.vault?.id!] || {
              id: vault.vault?.id!,
              minApy: 0,
              certainty: false,
            },
        ),
      ),
    );
    this.symbols$ = combineLatest([this.vaults$, symbolMetadataMap$]).pipe(
      map(([vaults, symbolMetadataMap]) =>
        vaults.map((vault) => {
          const symbol = vault.vault?.symbol || '';
          const display = symbolMetadataMap?.[symbol]?.display || symbol;
          const img = this.bankQuery.getSymbolImageMap()[symbol];
          return { symbol: symbol, display: display, img: img };
        }),
      ),
    );
    this.totalDeposits$ = combineLatest([this.vaults$, symbolPriceMap$]).pipe(
      map(([vaults, symbolPriceMap]) =>
        vaults.map((vault) =>
          this.bandProtocolService.calcUSDAmount(
            vault.vault?.symbol || '',
            this.depositAmount(vault),
            symbolPriceMap,
          ),
        ),
      ),
    );
  }

  ngOnInit(): void {}

  appSearchValueChanged(value: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        keyword: value,
      },
      queryParamsHandling: 'merge',
    });
  }

  appSortValueChanged(value: string): void {
    this.sortType$.next(value);
  }

  appCertifiedFilterChanged(value: boolean): void {
    this.certified$.next(value);
  }

  depositAmount(vault: VaultAll200ResponseVaultsInner): number {
    const deposit =
      Number(vault.total_bonded_amount) +
      Number(vault.total_unbonding_amount) +
      Number(vault.withdraw_reserve);
    return deposit;
  }
}
