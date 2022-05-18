import { DebtMenuDialogComponent } from './debt-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DebtMenuDialogModule } from 'projects/portal/src/app/views/dialogs/mint/debt-menu-dialog/debt-menu-dialog.module';

@NgModule({
  declarations: [DebtMenuDialogComponent],
  imports: [CommonModule, DebtMenuDialogModule],
})
export class AppDebtMenuDialogModule {}
