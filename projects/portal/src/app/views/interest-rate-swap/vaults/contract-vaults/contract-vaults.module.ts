import { ContractVaultsComponent } from './contract-vaults.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ContractVaultsComponent],
  imports: [CommonModule, RouterModule],
  exports: [ContractVaultsComponent],
})
export class ContractVaultsModule {}
