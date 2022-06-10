import { MaterialModule } from '../../../../material.module';
import { UnunifiBackupPrivateKeyWizardDialogComponent } from './ununifi-backup-private-key-wizard-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';

@NgModule({
  declarations: [UnunifiBackupPrivateKeyWizardDialogComponent],
  imports: [CommonModule, MaterialModule, FormsModule, MatStepperModule],
  exports: [UnunifiBackupPrivateKeyWizardDialogComponent],
})
export class UnunifiBackupPrivateKeyWizardDialogModule {}
