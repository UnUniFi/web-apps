import { WithdrawIncentiveRewardFormDialogComponent } from './withdraw-incentive-reward-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WithdrawIncentiveRewardFormDialogModule } from 'projects/portal/src/app/views/dialogs/incentive/withdraw-incentive-reward-form-dialog/withdraw-incentive-reward-form-dialog.module';

@NgModule({
  declarations: [WithdrawIncentiveRewardFormDialogComponent],
  imports: [CommonModule, WithdrawIncentiveRewardFormDialogModule],
})
export class AppWithdrawIncentiveRewardFormDialogModule {}
