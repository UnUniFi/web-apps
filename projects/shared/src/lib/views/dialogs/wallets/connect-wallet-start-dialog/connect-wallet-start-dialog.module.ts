import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConnectWalletStartDialogComponent } from 'projects/shared/src/lib/views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.component';
import { MaterialModule } from 'projects/shared/src/lib/views/material.module';

@NgModule({
  declarations: [ConnectWalletStartDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConnectWalletStartDialogComponent],
})
export class ConnectWalletStartDialogModule {}
