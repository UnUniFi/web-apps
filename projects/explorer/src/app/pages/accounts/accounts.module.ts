import { AccountModule } from '../../views/accounts/account/account.module';
import { DistributionModule } from '../../views/accounts/account/distribution/distribution.module';
import { StakingModule } from '../../views/accounts/account/staking/staking.module';
import { TxsModule } from '../../views/accounts/account/txs/txs.module';
import { AddressModule } from '../../views/accounts/yieldaggregator/address/address.module';
import { YieldaggregatorModule } from '../../views/accounts/yieldaggregator/yieldaggregator.module';
import { AccountComponent } from './account/account.component';
import { DistributionComponent } from './account/distribution/distribution.component';
import { StakingComponent } from './account/staking/staking.component';
import { TxsComponent } from './account/txs/txs.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { AddressComponent } from './yieldaggregator/address/address.component';
import { YieldaggregatorComponent } from './yieldaggregator/yieldaggregator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AccountComponent,
    StakingComponent,
    DistributionComponent,
    TxsComponent,
    YieldaggregatorComponent,
    AddressComponent,
  ],
  imports: [
    CommonModule,
    AccountsRoutingModule,
    AccountModule,
    StakingModule,
    DistributionModule,
    TxsModule,
    YieldaggregatorModule,
    AddressModule,
  ],
})
export class AppAccountsModule {}
