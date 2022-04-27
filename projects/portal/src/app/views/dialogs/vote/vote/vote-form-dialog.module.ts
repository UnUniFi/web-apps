import { MaterialModule } from '../../../material.module';
import { VoteFormDialogComponent } from './vote-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VoteFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [VoteFormDialogComponent],
})
export class VoteFormDialogModule {}
