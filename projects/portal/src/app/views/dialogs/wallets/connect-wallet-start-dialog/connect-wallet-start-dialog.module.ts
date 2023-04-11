import { MaterialModule } from '../../../material.module';
import { ConnectWalletStartDialogComponent } from './connect-wallet-start-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ConnectWalletStartDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [ConnectWalletStartDialogComponent],
})
export class ConnectWalletStartDialogModule {}
