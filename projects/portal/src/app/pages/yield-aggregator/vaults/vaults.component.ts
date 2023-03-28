import { BankQueryService } from '../../../models/cosmos/bank.query.service';
import { YieldAggregatorQueryService } from '../../../models/ununifi/yield-aggregator.query.service';
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
  symbols$: Observable<string[]>;

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
    const denomMetadataMap$ = this.bankQuery.getDenomMetadataMap$();
    this.symbols$ = combineLatest([this.vaults$, denomMetadataMap$]).pipe(
      map(([vaults, denomMetadataMap]) =>
        vaults.map((vault) => denomMetadataMap?.[vault.denom!].symbol || 'Invalid Asset'),
      ),
    );

    //dummy
    // this.vaults$ = of([
    //   {
    //     id: '1',
    //     denom: 'uusdc',
    //     owner: 'ununifi155u042u8wk3al32h3vzxu989jj76k4zcu44v6w',
    //     owner_deposit: { amount: '1000000', denom: 'uusdc' },
    //     withdraw_commission_rate: '0.02',
    //     withdraw_reserve_rate: '0.015',
    //     strategy_weights: [
    //       { strategy_id: 'st01', weight: '0.6' },
    //       { strategy_id: 'st02', weight: '0.4' },
    //     ],
    //   },
    // ]);

    this.vaults$.subscribe((vaults) => console.log(vaults));
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
