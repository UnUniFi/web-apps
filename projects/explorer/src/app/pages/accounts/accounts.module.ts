import { AccountModule } from '../../views/accounts/account/account.module';
import { DistributionModule } from '../../views/accounts/account/distribution/distribution.module';
import { StakingModule } from '../../views/accounts/account/staking/staking.module';
import { TxsModule } from '../../views/accounts/account/txs/txs.module';
import { AccountComponent } from './account/account.component';
import { DistributionComponent } from './account/distribution/distribution.component';
import { StakingComponent } from './account/staking/staking.component';
import { TxsComponent } from './account/txs/txs.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AccountComponent, StakingComponent, DistributionComponent, TxsComponent],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    AccountModule,
    StakingModule,
    DistributionModule,
    TxsModule,
  ],
})
export class AppAccountsModule {}
