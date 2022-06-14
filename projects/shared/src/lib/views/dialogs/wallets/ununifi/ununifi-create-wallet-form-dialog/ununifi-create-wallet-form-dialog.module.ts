import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UnunifiCreateWalletFormDialogComponent } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-create-wallet-form-dialog/ununifi-create-wallet-form-dialog.component';
import { MaterialModule } from 'projects/shared/src/lib/views/material.module';

@NgModule({
  declarations: [UnunifiCreateWalletFormDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule, ClipboardModule],
  exports: [UnunifiCreateWalletFormDialogComponent],
})
export class UnunifiCreateWalletFormDialogModule {}
