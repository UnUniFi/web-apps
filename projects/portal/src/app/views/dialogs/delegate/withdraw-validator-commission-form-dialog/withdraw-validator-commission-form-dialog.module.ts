import { MaterialModule } from '../../../material.module';
import { WithdrawValidatorCommissionFormDialogComponent } from './withdraw-validator-commission-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [WithdrawValidatorCommissionFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [WithdrawValidatorCommissionFormDialogComponent],
})
export class WithdrawValidatorCommissionFormDialogModule {}
