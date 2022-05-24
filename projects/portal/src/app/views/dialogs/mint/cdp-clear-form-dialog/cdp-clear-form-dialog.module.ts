import { MaterialModule } from '../../../material.module';
import { CdpClearFormDialogComponent } from './cdp-clear-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CdpClearFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [CdpClearFormDialogComponent],
})
export class CdpClearFormDialogModule {}
