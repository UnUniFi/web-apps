import { UnunifiCreateWalletFormDialogComponent } from '../../../../../../lib/views/dialogs/wallets/ununifi/ununifi-create-wallet-form-dialog/ununifi-create-wallet-form-dialog.component';
import { MaterialModule } from '../../../../../../lib/views/material.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnunifiCreateWalletFormDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ClipboardModule],
  exports: [UnunifiCreateWalletFormDialogComponent],
})
export class UnunifiCreateWalletFormDialogModule {}
