import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { YieldAggregatorApplicationService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.application.service';
import {
  DepositToVaultRequest,
  WithdrawFromVaultRequest,
} from 'projects/portal/src/app/models/ununifi/yield-aggregator.model';
import { YieldAggregatorQueryService } from 'projects/portal/src/app/models/ununifi/yield-aggregator.query.service';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { VaultAll200ResponseVaultsInner } from 'ununifi-client/esm/openapi';

@Component({
  selector: 'app-vault',
  templateUrl: './vault.component.html',
  styleUrls: ['./vault.component.css'],
})
export class VaultComponent implements OnInit {
  vault$: Observable<VaultAll200ResponseVaultsInner>;

  constructor(
    private route: ActivatedRoute,
    private readonly iyaQuery: YieldAggregatorQueryService,
    private readonly iyaApp: YieldAggregatorApplicationService,
  ) {
    const vaultId$ = this.route.params.pipe(map((params) => params.vault_id));
    this.vault$ = vaultId$.pipe(mergeMap((id) => this.iyaQuery.getVault$(id)));
    //dummy
    this.vault$ = of({
      id: '1',
      denom: 'uusdc',
      owner: 'ununifi155u042u8wk3al32h3vzxu989jj76k4zcu44v6w',
      owner_deposit: { amount: '1000000', denom: 'uusdc' },
      withdraw_commission_rate: '0.02',
      withdraw_reserve_rate: '0.015',
      strategy_weights: [
        { strategy_id: 'st01', weight: '0.6' },
        { strategy_id: 'st02', weight: '0.4' },
      ],
    });
  }

  ngOnInit(): void {}

  onDeposit(data: DepositToVaultRequest) {
    this.iyaApp.depositToVault(data.vaultId, data.symbol, data.amount);
  }

  onWithdraw(data: WithdrawFromVaultRequest) {
    this.iyaApp.withdrawFromVault(data.vaultId, data.symbol, data.amount);
  }
}
