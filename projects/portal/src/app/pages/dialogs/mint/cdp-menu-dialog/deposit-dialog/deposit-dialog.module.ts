import { DepositDialogComponent } from './deposit-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DepositModule } from 'projects/portal/src/app/views/mint/cdps/cdp/deposit/deposit.module';

@NgModule({
  declarations: [DepositDialogComponent],
  imports: [CommonModule, DepositModule],
})
export class AppDepositDialogModule {}
