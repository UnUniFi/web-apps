import { DepositFormDialogComponent } from './deposit-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DepositFormDialogModule } from 'projects/portal/src/app/views/dialogs/vote/deposit/deposit-form-dialog.module';

@NgModule({
  declarations: [DepositFormDialogComponent],
  imports: [CommonModule, DepositFormDialogModule],
})
export class AppDepositFormDialogModule {}
