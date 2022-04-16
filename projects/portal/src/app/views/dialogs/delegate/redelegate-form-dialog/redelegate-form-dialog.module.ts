import { MaterialModule } from '../../../material.module';
import { RedelegateFormDialogComponent } from './redelegate-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [RedelegateFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [RedelegateFormDialogComponent],
})
export class RedelegateFormDialogModule {}
