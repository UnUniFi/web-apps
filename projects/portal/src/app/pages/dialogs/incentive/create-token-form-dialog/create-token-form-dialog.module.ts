import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateTokenFormDialogModule } from 'projects/portal/src/app/views/dialogs/incentive/create-token-form-dialog/create-token-form-dialog.module';
import { CreateTokenFormDialogComponent } from './create-token-form-dialog.component';

@NgModule({
  declarations: [CreateTokenFormDialogComponent],
  imports: [CommonModule, CreateTokenFormDialogModule],
})
export class AppCreateTokenFormDialogModule {}
