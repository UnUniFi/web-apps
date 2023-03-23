import { MaterialModule } from '../../../material.module';
import { RedelegateFormDialogComponent } from './redelegate-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [RedelegateFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule, PipesModule],
  exports: [RedelegateFormDialogComponent],
})
export class RedelegateFormDialogModule {}
