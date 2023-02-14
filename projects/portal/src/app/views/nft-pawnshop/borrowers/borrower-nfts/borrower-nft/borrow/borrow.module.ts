import { BorrowComponent } from './borrow.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';
import { MaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [BorrowComponent],
  imports: [CommonModule, GoogleChartsModule, FormsModule, MaterialModule],
  exports: [BorrowComponent],
})
export class BorrowModule {}
