import { UndelegateFormDialogComponent } from './undelegate-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UndelegateFormDialogModule } from 'projects/portal/src/app/views/dialogs/delegate/undelegate-form-dialog/undelegate-form-dialog.module';

@NgModule({
  declarations: [UndelegateFormDialogComponent],
  imports: [CommonModule, UndelegateFormDialogModule],
})
export class AppUndelegateFormDialogModule {}
