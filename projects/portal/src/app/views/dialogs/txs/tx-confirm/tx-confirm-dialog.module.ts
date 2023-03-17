import { MaterialModule } from '../../../material.module';
import { TxConfirmDialogComponent } from './tx-confirm-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TxConfirmDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [TxConfirmDialogComponent],
})
export class TxConfirmDialogModule {}
