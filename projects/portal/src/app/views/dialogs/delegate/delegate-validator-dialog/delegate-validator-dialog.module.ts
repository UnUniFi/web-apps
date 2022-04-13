import { MaterialModule } from '../../../material.module';
import { DelegateValidatorDialogComponent } from './delegate-validator-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DelegateValidatorDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [DelegateValidatorDialogComponent],
})
export class DelegateValidatorDialogModule {}
