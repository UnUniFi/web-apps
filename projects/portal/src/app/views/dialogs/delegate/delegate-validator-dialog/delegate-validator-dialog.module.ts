import { MaterialModule } from '../../../material.module';
import { DelegateValidatorDialogComponent } from './delegate-validator-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DelegateValidatorDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [DelegateValidatorDialogComponent],
})
export class DelegateValidatorDialogModule {}
