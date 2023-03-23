import { BorrowComponent } from './borrow.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GoogleChartsModule } from 'angular-google-charts';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';
import { MaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [BorrowComponent],
  imports: [CommonModule, GoogleChartsModule, FormsModule, MaterialModule, PipesModule],
  exports: [BorrowComponent],
})
export class BorrowModule {}
