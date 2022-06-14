import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConnectWalletCompletedDialogComponent } from 'projects/shared/src/lib/views/dialogs/wallets/connect-wallet-completed-dialog/connect-wallet-completed-dialog.component';
import { MaterialModule } from 'projects/shared/src/lib/views/material.module';

@NgModule({
  declarations: [ConnectWalletCompletedDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConnectWalletCompletedDialogComponent],
})
export class ConnectWalletCompletedDialogModule {}
