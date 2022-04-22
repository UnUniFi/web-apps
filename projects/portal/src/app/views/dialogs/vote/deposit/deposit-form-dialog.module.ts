import { MaterialModule } from '../../../material.module';
import { DepositFormDialogComponent } from './deposit-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DepositFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [DepositFormDialogComponent],
})
export class DepositFormDialogModule {}
