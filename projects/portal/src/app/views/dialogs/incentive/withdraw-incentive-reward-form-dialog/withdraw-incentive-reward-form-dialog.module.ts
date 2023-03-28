import { WithdrawIncentiveRewardFormDialogComponent } from './withdraw-incentive-reward-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WithdrawIncentiveRewardFormDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [WithdrawIncentiveRewardFormDialogComponent],
})
export class WithdrawIncentiveRewardFormDialogModule { }
