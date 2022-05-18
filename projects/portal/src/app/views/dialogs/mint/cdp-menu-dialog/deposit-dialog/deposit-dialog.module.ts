import { DepositDialogComponent } from './deposit-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'projects/explorer/src/app/views/material.module';

@NgModule({
  declarations: [DepositDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [DepositDialogComponent],
})
export class DepositDialogModule {}
