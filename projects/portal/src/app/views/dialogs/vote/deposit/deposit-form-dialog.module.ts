import { DepositFormDialogComponent } from './deposit-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [DepositFormDialogComponent],
  imports: [CommonModule, FormsModule, PipesModule],
  exports: [DepositFormDialogComponent],
})
export class DepositFormDialogModule {}
