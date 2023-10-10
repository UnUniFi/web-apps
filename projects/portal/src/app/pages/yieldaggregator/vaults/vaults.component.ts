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
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
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
  sortType$: Observable<string>;
  sortTypes: { value: string; display: string }[] = [
    { value: 'id', display: 'Vault ID #' },
    { value: 'name', display: 'Vault Name' },
    { value: 'apy', display: 'APY' },
  ];
  // certified$: Observable<boolean>;
  certified$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  certifiedVaults$: Observable<VaultAll200ResponseVaultsInner[]>;

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
    this.sortType$ = this.route.queryParams.pipe(
      map((params) => params.sort || this.sortTypes[0].value),
    );
    // this.certified$ = this.route.queryParams.pipe(map((params) => params.certified || true));
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    const vaultsInfo$ = combineLatest([vaults$, config$]).pipe(
      mergeMap(async ([vaults, config]) =>
        Promise.all(vaults.map(async (vault) => this.iyaService.calcVaultAPY(vault, config))),
      ),
    );
    this.vaults$ = combineLatest([
      vaults$,
      this.keyword$,
      this.sortType$,
      denomMetadataMap$,
      vaultsInfo$,
    ]).pipe(
      map(([vaults, keyword, sort, denomMetadata, infos]) => {
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
        } else if (sort) {
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
              const aInfo = infos.find((info) => info.id === a.vault?.id);
              const bInfo = infos.find((info) => info.id === b.vault?.id);
              return (bInfo?.minApy || 0) - (aInfo?.minApy || 0);
            });
          }
          return vaults;
        } else {
          return vaults;
        }
      }),
    );
    this.certifiedVaults$ = combineLatest([this.vaults$, config$]).pipe(
      map(
        ([vaults, config]) =>
          config?.certifiedVaults
            .map((id) => vaults.find((vault) => vault.vault?.id === id))
            .filter((vault): vault is VaultAll200ResponseVaultsInner => vault !== undefined) || [],
      ),
    );
    this.vaultsInfo$ = combineLatest([this.vaults$, vaultsInfo$]).pipe(
      map(([vaults, infos]) =>
        vaults.map(
          (vault) =>
            infos.find((info) => info.id === vault.vault?.id) || {
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
    const symbolMetadataMap$ = this.bankQuery.getSymbolMetadataMap$();
    this.totalDeposited$ = combineLatest([this.symbols$, this.vaults$, symbolMetadataMap$]).pipe(
      mergeMap(([symbols, vaults, symbolMetadataMap]) =>
        Promise.all(
          vaults.map((vault, index) =>
            this.bandProtocolService.convertToUSDAmountSymbol(
              symbols[index].symbol,
              (
                Number(vault.total_bonded_amount) +
                Number(vault.total_unbonding_amount) +
                Number(vault.withdraw_reserve)
              ).toString(),
              symbolMetadataMap,
            ),
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
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
      queryParamsHandling: 'merge',
    });
  }

  appCertifiedFilterChanged(value: boolean): void {
    this.certified$.next(value);
    // this.router.navigate([], {
    //   relativeTo: this.route,
    //   queryParams: {
    //     certified: value,
    //   },
    //   queryParamsHandling: 'merge',
    // });
  }
}
