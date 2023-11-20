import { WithdrawFeeConfirmDialogComponent } from './withdraw-fee-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [WithdrawFeeConfirmDialogComponent],
  imports: [CommonModule, PipesModule],
  exports: [WithdrawFeeConfirmDialogComponent],
})
export class WithdrawFeeConfirmDialogModule {}
