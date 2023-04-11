import { MaterialModule } from '../../../../material.module';
import { UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent } from './ununifi-backup-mnemonic-and-private-key-wizard-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent],
})
export class UnunifiBackupMnemonicAndPrivateKeyWizardDialogModule {}
