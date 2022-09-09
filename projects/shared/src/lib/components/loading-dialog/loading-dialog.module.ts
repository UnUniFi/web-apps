import { LoadingDialogComponent } from './loading-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [LoadingDialogComponent],
  imports: [CommonModule, MatDialogModule, MatProgressSpinnerModule],
  exports: [LoadingDialogComponent],
})
export class LoadingDialogModule {}
