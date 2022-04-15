import { RedelegateFormDialogComponent } from './redelegate-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RedelegateFormDialogModule } from 'projects/portal/src/app/views/dialogs/delegate/redelegate-form-dialog/redelegate-form-dialog.module';

@NgModule({
  declarations: [RedelegateFormDialogComponent],
  imports: [CommonModule, RedelegateFormDialogModule],
})
export class AppRedelegateFormDialogModule {}
