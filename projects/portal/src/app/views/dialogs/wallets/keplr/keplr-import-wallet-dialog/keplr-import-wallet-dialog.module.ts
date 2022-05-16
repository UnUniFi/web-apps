import { MaterialModule } from '../../../../material.module';
import { KeplrImportWalletDialogComponent } from './keplr-import-wallet-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [KeplrImportWalletDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [KeplrImportWalletDialogComponent],
})
export class KeplrImportWalletDialogModule {}
