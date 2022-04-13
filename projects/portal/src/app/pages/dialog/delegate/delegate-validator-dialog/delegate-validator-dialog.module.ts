import { DelegateValidatorDialogComponent } from './delegate-validator-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DelegateValidatorDialogModule } from 'projects/portal/src/app/views/dialogs/delegate/delegate-validator-dialog/delegate-validator-dialog.module';

@NgModule({
  declarations: [DelegateValidatorDialogComponent],
  imports: [CommonModule, DelegateValidatorDialogModule],
})
export class AppDelegateValidatorDialogModule {}
