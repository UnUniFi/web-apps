import { MaterialModule } from '../../../../material.module';
import { UnunifiBackupPrivateKeyWizardDialogComponent } from './ununifi-backup-private-key-wizard-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnunifiBackupPrivateKeyWizardDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [UnunifiBackupPrivateKeyWizardDialogComponent],
})
export class UnunifiBackupPrivateKeyWizardDialogModule {}
