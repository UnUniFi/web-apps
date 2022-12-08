import { MaterialModule } from '../../../material.module';
import { CreateTokenFormDialogComponent } from './create-token-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateTokenFormDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [CreateTokenFormDialogComponent],
})
export class CreateTokenFormDialogModule {}
