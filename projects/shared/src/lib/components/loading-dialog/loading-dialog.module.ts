import { LoadingDialogComponent } from './loading-dialog.component';
import { DialogModule } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LoadingDialogComponent],
  imports: [CommonModule, DialogModule],
  exports: [LoadingDialogComponent],
})
export class LoadingDialogModule { }
