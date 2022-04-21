import { MaterialModule } from '../../../material.module';
import { InactiveValidatorConfirmDialogComponent } from './inactive-validator-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [InactiveValidatorConfirmDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [InactiveValidatorConfirmDialogComponent],
})
export class InactiveValidatorModule {}
