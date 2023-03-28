import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.application.service';
import { TransferVaultRequest } from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.query.service';
import { StoredWallet } from 'projects/portal/src/app/models/wallets/wallet.model';
import { WalletService } from 'projects/portal/src/app/models/wallets/wallet.service';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-owner',
  templateUrl: './owner.component.html',
  styleUrls: ['./owner.component.css'],
})
export class OwnerComponent implements OnInit {
  address$: Observable<string>;
  owner$: Observable<string>;
  vaults$: Observable<VaultAll200ResponseVaultsInner[]>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private readonly walletService: WalletService,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaApp: YieldAggregatorApplicationService,
  ) {
    this.address$ = this.walletService.currentStoredWallet$.pipe(
      filter((wallet): wallet is StoredWallet => wallet !== undefined && wallet !== null),
      map((wallet) => wallet.address),
    );
    this.owner$ = this.route.params.pipe(map((params) => params.address));
    this.owner$.subscribe((owner) => console.log(owner));
    this.vaults$ = combineLatest([this.iyaQuery.listVaults$(), this.owner$]).pipe(
      map(([vaults, owner]) => vaults.filter((vault) => vault.owner === owner)),
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
  }

  ngOnInit(): void {}

  onDelete(data: string) {
    this.iyaApp.deleteVault(data);
  }

  onTransfer(data: TransferVaultRequest) {
    this.iyaApp.transferVaultOwnership(data.vaultId, data.recipientAddress);
  }
}
