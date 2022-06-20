import { MaterialModule } from '../../../../material.module';
import { UnunifiSelectCreateImportDialogComponent } from './ununifi-select-create-import-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [UnunifiSelectCreateImportDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [UnunifiSelectCreateImportDialogComponent],
})
export class UnunifiSelectCreateImportDialogModule {}
