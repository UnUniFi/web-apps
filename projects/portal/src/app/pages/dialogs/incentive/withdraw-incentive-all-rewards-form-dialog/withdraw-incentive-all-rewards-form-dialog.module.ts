import { WithdrawIncentiveAllRewardsFormDialogComponent } from './withdraw-incentive-all-rewards-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WithdrawIncentiveAllRewardsFormDialogModule } from 'projects/portal/src/app/views/dialogs/incentive/withdraw-incentive-all-rewards-form-dialog/withdraw-incentive-all-rewards-form-dialog.module';

@NgModule({
  declarations: [WithdrawIncentiveAllRewardsFormDialogComponent],
  imports: [CommonModule, WithdrawIncentiveAllRewardsFormDialogModule],
})
export class AppWithdrawIncentiveAllRewardsFormDialogModule {}
