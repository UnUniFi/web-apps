import { MaterialModule } from '../../../../material.module';
import { UnunifiImportWalletWithMnemonicFormDialogComponent } from './ununifi-import-wallet-with-mnemonic-form-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnunifiImportWalletWithMnemonicFormDialogComponent],
  imports: [CommonModule, FormsModule, ClipboardModule, MaterialModule],
  exports: [UnunifiImportWalletWithMnemonicFormDialogComponent],
})
export class UnunifiImportWalletWithMnemonicFormDialogModule {}
