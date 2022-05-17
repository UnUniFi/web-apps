import { MaterialModule } from '../../../material.module';
import { DebtMenuDialogComponent } from './debt-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DebtMenuDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [DebtMenuDialogComponent],
})
export class DebtMenuDialogModule {}
