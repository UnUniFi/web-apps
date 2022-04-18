import { VoteFormDialogComponent } from './vote-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { VoteFormDialogModule } from 'projects/portal/src/app/views/dialogs/vote/vote/vote-form-dialog.module';

@NgModule({
  declarations: [VoteFormDialogComponent],
  imports: [CommonModule, VoteFormDialogModule],
})
export class AppVoteFormDialogModule {}
