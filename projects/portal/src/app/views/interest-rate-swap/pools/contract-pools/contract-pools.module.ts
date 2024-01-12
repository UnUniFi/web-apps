import { ContractPoolsComponent } from './contract-pools.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ContractPoolsComponent],
  imports: [CommonModule, RouterModule],
  exports: [ContractPoolsComponent],
})
export class ContractPoolsModule {}
