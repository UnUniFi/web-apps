import { MaterialModule } from '../../../material.module';
import { ConnectWalletCompletedDialogComponent } from './connect-wallet-completed-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ConnectWalletCompletedDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConnectWalletCompletedDialogComponent],
})
export class ConnectWalletCompletedDialogModule {}
