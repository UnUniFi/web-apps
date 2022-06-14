import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent } from 'projects/shared/src/lib/views/dialogs/wallets/ununifi/ununifi-backup-mnemonic-and-private-key-wizard-dialog/ununifi-backup-mnemonic-and-private-key-wizard-dialog.component';
import { MaterialModule } from 'projects/shared/src/lib/views/material.module';

@NgModule({
  declarations: [UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule, MatStepperModule],
  exports: [UnunifiBackupMnemonicAndPrivateKeyWizardDialogComponent],
})
export class UnunifiBackupMnemonicAndPrivateKeyWizardDialogModule {}
