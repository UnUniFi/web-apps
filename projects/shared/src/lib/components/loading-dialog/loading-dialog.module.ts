import { LoadingDialogComponent } from './loading-dialog.component';
import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [LoadingDialogComponent],
  imports: [CommonModule, DialogModule, MatProgressSpinnerModule],
  exports: [LoadingDialogComponent],
})
export class LoadingDialogModule {}
