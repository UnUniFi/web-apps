import { AccountModule } from '../../views/accounts/account/account.module';
import { TxsModule } from '../../views/accounts/account/txs/txs.module';
import { AccountComponent } from './account/account.component';
import { TxsComponent } from './account/txs/txs.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AccountComponent, TxsComponent],
  imports: [CommonModule, AccountsRoutingModule, AccountModule, TxsModule],
})
export class AppAccountsModule {}
