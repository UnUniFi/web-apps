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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly bankQuery: BankQueryService,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    this.vaults$ = combineLatest([this.iyaQuery.listVaults$(), this.route.queryParams]).pipe(
      map(([vaults, params]) =>
        params.search
          ? vaults.filter((vault) => {
              const hasIdMatch = vault.id && vault.id.includes(params.search);
              const hasOwnerMatch = vault.owner && vault.owner.includes(params.search);
              const hasDenomMatch = vault.denom && vault.denom.includes(params.search);
              return hasIdMatch || hasOwnerMatch || hasDenomMatch;
            })
          : vaults,
      ),
    );
    this.vaults$ = of([
      {
        id: '1',
        owner: 'ununifi155u042u8wk3al32h3vzxu989jj76k4zcu44v6w',
        denom: 'uatom',
        withdraw_commission_rate: '0.1',
        withdraw_reserve_rate: '0.3',
      },
      {
        id: '2',
        owner: 'ununifi1v0h8j7x7kfys29kj4uwdudcc9y0nx6twwxahla',
        denom: 'uosmo',
        withdraw_commission_rate: '0.12',
        withdraw_reserve_rate: '0.2',
      },
      {
        id: '3',
        owner: 'ununifi1y3t7sp0nfe2nfda7r9gf628g6ym6e7d44evfv6',
        denom: 'uguu',
        withdraw_commission_rate: '0.05',
        withdraw_reserve_rate: '0.155',
      },
    ]);
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
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
        search: value,
      },
      queryParamsHandling: 'merge',
    });
  }
}
