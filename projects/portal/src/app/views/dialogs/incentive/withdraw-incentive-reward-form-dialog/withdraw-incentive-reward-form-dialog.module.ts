import { MaterialModule } from '../../../material.module';
import { WithdrawIncentiveRewardFormDialogComponent } from './withdraw-incentive-reward-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WithdrawIncentiveRewardFormDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [WithdrawIncentiveRewardFormDialogComponent],
})
export class WithdrawIncentiveRewardFormDialogModule {}
