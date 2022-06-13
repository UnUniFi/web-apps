import { WithdrawValidatorCommissionFormDialogComponent } from './withdraw-validator-commission-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WithdrawValidatorCommissionFormDialogModule } from 'projects/portal/src/app/views/dialogs/delegate/withdraw-validator-commission-form-dialog/withdraw-validator-commission-form-dialog.module';

@NgModule({
  declarations: [WithdrawValidatorCommissionFormDialogComponent],
  imports: [CommonModule, WithdrawValidatorCommissionFormDialogModule],
})
export class AppWithdrawValidatorCommissionFormDialogModule {}
