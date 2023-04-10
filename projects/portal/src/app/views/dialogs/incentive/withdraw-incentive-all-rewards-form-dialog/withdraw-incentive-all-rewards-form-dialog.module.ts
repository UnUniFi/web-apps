import { MaterialModule } from '../../../material.module';
import { WithdrawIncentiveAllRewardsFormDialogComponent } from './withdraw-incentive-all-rewards-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WithdrawIncentiveAllRewardsFormDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [WithdrawIncentiveAllRewardsFormDialogComponent],
})
export class WithdrawIncentiveAllRewardsFormDialogModule {}
