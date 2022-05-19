import { CdpDepositFormDialogComponent } from './cdp-deposit-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdpDepositFormDialogModule } from 'projects/portal/src/app/views/dialogs/mint/cdp-deposit-form-dialog/cdp-deposit-form-dialog.module';

@NgModule({
  declarations: [CdpDepositFormDialogComponent],
  imports: [CommonModule, CdpDepositFormDialogModule],
})
export class AppCdpDepositFormDialogModule {}
