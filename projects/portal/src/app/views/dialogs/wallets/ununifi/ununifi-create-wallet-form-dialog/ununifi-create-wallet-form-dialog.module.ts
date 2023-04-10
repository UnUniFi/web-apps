import { MaterialModule } from '../../../../material.module';
import { UnunifiCreateWalletFormDialogComponent } from './ununifi-create-wallet-form-dialog.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnunifiCreateWalletFormDialogComponent],
  imports: [CommonModule, FormsModule, ClipboardModule, MaterialModule],
  exports: [UnunifiCreateWalletFormDialogComponent],
})
export class UnunifiCreateWalletFormDialogModule {}
