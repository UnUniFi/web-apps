import { CreateUnitFormDialogComponent } from './create-unit-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateUnitFormDialogModule } from 'projects/portal/src/app/views/dialogs/incentive/create-unit-form-dialog/create-unit-form-dialog.module';

@NgModule({
  declarations: [CreateUnitFormDialogComponent],
  imports: [CommonModule, CreateUnitFormDialogModule],
})
export class AppCreateUnitFormDialogModule {}
