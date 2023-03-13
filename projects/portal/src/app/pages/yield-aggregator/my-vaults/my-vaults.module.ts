import { CreateModule } from '../../../views/yield-aggregator/my-vaults/create/create.module';
import { MyVaultsModule } from '../../../views/yield-aggregator/my-vaults/my-vaults.module';
import { VaultModule } from '../../../views/yield-aggregator/my-vaults/vault/vault.module';
import { CreateComponent } from './create/create.component';
import { MyVaultsRoutingModule } from './my-vaults-routing.module';
import { MyVaultsComponent } from './my-vaults.component';
import { VaultComponent } from './vault/vault.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MyVaultsComponent, VaultComponent, CreateComponent],
  imports: [CommonModule, MyVaultsRoutingModule, MyVaultsModule, VaultModule, CreateModule],
})
export class AppMyVaultsModule {}
