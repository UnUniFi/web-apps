import { MaterialModule } from '../../../material.module';
import { ConnectExternalWalletDialogComponent } from './connect-external-wallet-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ConnectExternalWalletDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConnectExternalWalletDialogComponent],
})
export class ConnectExternalWalletDialogModule {}
