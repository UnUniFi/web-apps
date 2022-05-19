import { MaterialModule } from '../../../material.module';
import { CdpDepositFormDialogComponent } from './cdp-deposit-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CdpDepositFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [CdpDepositFormDialogComponent],
})
export class CdpDepositFormDialogModule {}
