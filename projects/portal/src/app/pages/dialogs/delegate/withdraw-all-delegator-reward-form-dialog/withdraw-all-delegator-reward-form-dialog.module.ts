import { WithdrawAllDelegatorRewardFormDialogComponent } from './withdraw-all-delegator-reward-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WithdrawAllDelegatorRewardFormDialogModule } from 'projects/portal/src/app/views/dialogs/delegate/withdraw-all-delegator-reward-form-dialog/withdraw-all-delegator-reward-form-dialog.module';

@NgModule({
  declarations: [WithdrawAllDelegatorRewardFormDialogComponent],
  imports: [CommonModule, WithdrawAllDelegatorRewardFormDialogModule],
})
export class AppWithdrawAllDelegatorRewardFormDialogModule {}
