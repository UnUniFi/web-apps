import { MaterialModule } from '../../../material.module';
import { UndelegateFormDialogComponent } from './undelegate-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UndelegateFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [UndelegateFormDialogComponent],
})
export class UndelegateFormDialogModule {}
