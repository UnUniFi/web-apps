import { MaterialModule } from '../../../material.module';
import { CreateUnitFormDialogComponent } from './create-unit-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateUnitFormDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MaterialModule],
  exports: [CreateUnitFormDialogComponent],
})
export class CreateUnitFormDialogModule {}
