import { YieldAggregatorQueryService } from '../../../models/ununifi/yield-aggregator.query.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-vaults',
  templateUrl: './vaults.component.html',
  styleUrls: ['./vaults.component.css'],
})
export class VaultsComponent implements OnInit {
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly iyaQuery: YieldAggregatorQueryService,
  ) {
    this.vaults$ = combineLatest([this.iyaQuery.listVaults$(), this.route.queryParams]).pipe(
      map(([vaults, params]) =>
        params
          ? vaults.filter((vault) => {
              const hasIdMatch = vault.id && vault.id.includes(params.search);
              const hasOwnerMatch = vault.owner && vault.owner.includes(params.search);
              const hasDenomMatch = vault.denom && vault.denom.includes(params.search);
              return hasIdMatch || hasOwnerMatch || hasDenomMatch;
            })
          : vaults,
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
    });
  }
}
