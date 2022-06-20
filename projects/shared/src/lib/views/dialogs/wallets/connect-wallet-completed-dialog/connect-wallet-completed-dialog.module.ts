import { ConnectWalletCompletedDialogComponent } from '../../../../../lib/views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.component';
import { MaterialModule } from '../../../../../lib/views/material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ConnectWalletCompletedDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConnectWalletCompletedDialogComponent],
})
export class ConnectWalletCompletedDialogModule {}
