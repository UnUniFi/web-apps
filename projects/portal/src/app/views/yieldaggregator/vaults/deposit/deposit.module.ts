import { DepositComponent } from './deposit.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DepositComponent],
  imports: [CommonModule, RouterModule],
  exports: [DepositComponent],
})
export class DepositModule {}
