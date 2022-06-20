import { WithdrawDelegatorRewardFormDialogComponent } from './withdraw-delegator-reward-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WithdrawDelegatorRewardFormDialogModule } from 'projects/portal/src/app/views/dialogs/delegate/withdraw-delegator-reward-form-dialog/withdraw-delegator-reward-form-dialog.module';

@NgModule({
  declarations: [WithdrawDelegatorRewardFormDialogComponent],
  imports: [CommonModule, WithdrawDelegatorRewardFormDialogModule],
})
export class AppWithdrawDelegatorRewardFormDialogModule {}
