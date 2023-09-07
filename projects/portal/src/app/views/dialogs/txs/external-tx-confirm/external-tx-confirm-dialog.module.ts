import { MaterialModule } from '../../../material.module';
import { ExternalTxConfirmDialogComponent } from './external-tx-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ExternalTxConfirmDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ExternalTxConfirmDialogComponent],
})
export class ExternalTxConfirmDialogModule {}
