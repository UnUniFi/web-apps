import { MaterialModule } from '../../../material.module';
import { WithdrawAllDelegatorRewardFormDialogComponent } from './withdraw-all-delegator-reward-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [WithdrawAllDelegatorRewardFormDialogComponent],
  imports: [CommonModule, FormsModule, PipesModule, MaterialModule],
  exports: [WithdrawAllDelegatorRewardFormDialogComponent],
})
export class WithdrawAllDelegatorRewardFormDialogModule {}
