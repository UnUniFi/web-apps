import { MaterialModule } from '../../../material.module';
import { WithdrawDelegatorRewardFormDialogComponent } from './withdraw-delegator-reward-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [WithdrawDelegatorRewardFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [WithdrawDelegatorRewardFormDialogComponent],
})
export class WithdrawDelegatorRewardFormDialogModule {}
