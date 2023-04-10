import { MaterialModule } from '../../../material.module';
import { UndelegateFormDialogComponent } from './undelegate-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [UndelegateFormDialogComponent],
  imports: [CommonModule, FormsModule, PipesModule, MaterialModule],
  exports: [UndelegateFormDialogComponent],
})
export class UndelegateFormDialogModule {}
