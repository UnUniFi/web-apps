import {
  BandProtocolService,
  TokenAmountUSD,
} from '../../../models/band-protocols/band-protocol.service';
import { ConfigService, YieldInfo } from '../../../models/config.service';
import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { StoredWallet } from '../../../models/wallets/wallet.model';
import { WalletService } from '../../../models/wallets/wallet.service';
import { YieldAggregatorQueryService } from '../../../models/yield-aggregators/yield-aggregator.query.service';
import { YieldAggregatorService } from '../../../models/yield-aggregators/yield-aggregator.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, from, Observable } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
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
  vaultsInfo$: Observable<YieldInfo[]>;
  totalDeposited$: Observable<TokenAmountUSD[]>;
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
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    const symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    const osmoPools$ = from(this.iyaService.getAllOsmoPool());
    const vaultYields$ = combineLatest([vaults$, config$, osmoPools$]).pipe(
      map(([vaults, config, pools]) =>
        vaults.map((vault) => this.iyaService.calcVaultAPY(vault, config!, pools)),
      ),
    );
    const vaultYieldMap$ = vaultYields$.pipe(
      map((yields) => {
        const yieldMap: { [id: string]: YieldInfo } = {};
        for (const y of yields) {
          yieldMap[y.id] = y;
        }
        return yieldMap;
      }),
    );
    const vaultDeposits$ = combineLatest([vaults$, denomMetadataMap$, symbolMetadataMap$]).pipe(
      mergeMap(([vaults, denomMetadataMap, symbolMetadataMap]) =>
        Promise.all(
          vaults.map(async (vault) => {
            const deposits = await this.bandProtocolService.convertToUSDAmountSymbol(
              denomMetadataMap?.[vault.vault?.denom || '']?.symbol || '',
              (
                Number(vault.total_bonded_amount) +
                Number(vault.total_unbonding_amount) +
                Number(vault.withdraw_reserve)
              ).toString(),
              symbolMetadataMap,
            );
            return {
              vaultId: vault.vault?.id,
              depositInfo: deposits,
            };
          }),
        ),
      ),
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
    const searchedVaults$ = combineLatest([
      certifiedVaults$,
      this.keyword$,
      denomMetadataMap$,
    ]).pipe(
      map(([vaults, keyword, denomMetadata]) => {
        if (keyword) {
          return vaults.filter((vault) => {
            const hasIdMatch = vault.vault?.id && vault.vault?.id.includes(keyword);
            const hasOwnerMatch = vault.vault?.owner?.includes(keyword);
            const hasDenomMatch = vault.vault?.denom?.includes(keyword);
            const hasSymbolMatch = vault.vault?.denom
              ? denomMetadata?.[vault.vault?.denom].symbol?.includes(keyword)
              : false;
            return hasIdMatch || hasOwnerMatch || hasDenomMatch || hasSymbolMatch;
          });
        } else {
          return vaults;
        }
      }),
    );
    const sortedVaults$ = combineLatest([
      searchedVaults$,
      this.sortType$,
      vaultYields$,
      vaultDeposits$,
    ]).pipe(
      map(([vaults, sort, yields, deposits]) => {
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
            const aYield = yields.find((y) => y.id === a.vault?.id);
            const bYield = yields.find((y) => y.id === b.vault?.id);
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
            console.log('hoge');
            const aDeposit = deposits.find((d) => d.vaultId === a.vault?.id);
            const bDeposit = deposits.find((d) => d.vaultId === b.vault?.id);
            return (bDeposit?.depositInfo.usdAmount || 0) - (aDeposit?.depositInfo.usdAmount || 0);
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
    this.totalDeposited$ = combineLatest([this.vaults$, vaultDeposits$]).pipe(
      map(([vaults, deposits]) =>
        vaults.map((vault) => {
          const deposit = deposits.find((deposit) => deposit.vaultId === vault.vault?.id) || {
            vaultId: vault.vault?.id!,
            depositInfo: {
              symbol: '',
              display: '',
              symbolAmount: 0,
              usdAmount: 0,
            },
          };
          return deposit?.depositInfo;
        }),
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
}
