import { MaterialModule } from '../../../material.module';
import { DelegateFormDialogComponent } from './delegate-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [DelegateFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [DelegateFormDialogComponent],
})
export class DelegateFormDialogModule {}
