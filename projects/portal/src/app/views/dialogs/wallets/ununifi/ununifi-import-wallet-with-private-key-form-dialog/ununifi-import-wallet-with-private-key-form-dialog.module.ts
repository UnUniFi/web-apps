import { MaterialModule } from '../../../../material.module';
import { UnunifiImportWalletWithPrivateKeyFormDialogComponent } from './ununifi-import-wallet-with-private-key-form-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnunifiImportWalletWithPrivateKeyFormDialogComponent],
  imports: [CommonModule, FormsModule, ClipboardModule, MaterialModule],
  exports: [UnunifiImportWalletWithPrivateKeyFormDialogComponent],
})
export class UnunifiImportWalletWithPrivateKeyFormDialogModule {}
