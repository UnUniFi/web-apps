import { DelegateFormDialogComponent } from './delegate-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelegateFormDialogModule } from 'projects/portal/src/app/views/dialogs/delegate/delegate-form-dialog/delegate-form-dialog.module';

@NgModule({
  declarations: [DelegateFormDialogComponent],
  imports: [CommonModule, DelegateFormDialogModule],
})
export class AppDelegateFormDialogModule {}
