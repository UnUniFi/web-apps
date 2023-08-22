import { DepositComponent } from './deposit.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [DepositComponent],
  imports: [CommonModule, RouterModule, PipesModule],
  exports: [DepositComponent],
})
export class DepositModule {}
