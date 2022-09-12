import { MaterialModule } from '../../../material.module';
import { WithdrawAllDelegatorRewardFormDialogComponent } from './withdraw-all-delegator-reward-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [WithdrawAllDelegatorRewardFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [WithdrawAllDelegatorRewardFormDialogComponent],
})
export class WithdrawAllDelegatorRewardFormDialogModule {}
