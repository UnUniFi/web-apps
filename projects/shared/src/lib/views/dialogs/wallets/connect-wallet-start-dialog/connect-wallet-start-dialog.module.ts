import { ConnectWalletStartDialogComponent } from '../../../../../lib/views/dialogs/wallets/connect-wallet-start-dialog/connect-wallet-start-dialog.component';
import { MaterialModule } from '../../../../../lib/views/material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ConnectWalletStartDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConnectWalletStartDialogComponent],
})
export class ConnectWalletStartDialogModule {}
