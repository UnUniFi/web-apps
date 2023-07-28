import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from '../../../models/yield-aggregators/yield-aggregator.query.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
})
export class VaultsComponent implements OnInit {
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;
  symbols$: Observable<{ name: string; img: string }[]>;
  keyword$: Observable<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    this.keyword$ = this.route.queryParams.pipe(map((params) => params.keyword));
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.vaults$ = combineLatest([
      this.iyaQuery.listVaults$(),
      this.route.queryParams,
      denomMetadataMap$,
    ]).pipe(
      map(([vaults, params, denomMetadata]) =>
        params.keyword
          ? vaults.filter((vault) => {
              const hasIdMatch = vault.id && vault.id.includes(params.keyword);
              const hasOwnerMatch = vault.owner?.includes(params.keyword);
              const hasDenomMatch = vault.denom?.includes(params.keyword);
              const hasSymbolMatch = vault.denom
                ? denomMetadata?.[vault.denom].symbol?.includes(params.keyword)
                : false;
              return hasIdMatch || hasOwnerMatch || hasDenomMatch || hasSymbolMatch;
            })
          : vaults,
      ),
    );
    this.symbols$ = combineLatest([this.vaults$, denomMetadataMap$]).pipe(
      map(([vaults, denomMetadataMap]) =>
        vaults.map((vault) => {
          const symbol = denomMetadataMap?.[vault.denom!].symbol || 'Invalid Asset';
          const img = this.bankQuery.getSymbolImageMap()[symbol];
          return { name: symbol, img: img };
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
}
