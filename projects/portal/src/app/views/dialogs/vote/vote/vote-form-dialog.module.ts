import { VoteFormDialogComponent } from './vote-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [VoteFormDialogComponent],
  imports: [CommonModule, FormsModule],
  exports: [VoteFormDialogComponent],
})
export class VoteFormDialogModule {}
