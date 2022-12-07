import { IncentiveComponent } from './incentive.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'projects/explorer/src/app/views/material.module';

@NgModule({
  declarations: [IncentiveComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [IncentiveComponent],
})
export class IncentiveModule {}
