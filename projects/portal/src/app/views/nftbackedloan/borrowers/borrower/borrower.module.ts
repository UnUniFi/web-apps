import { MaterialModule } from '../../../material.module';
import { BorrowerComponent } from './borrower.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BorrowerComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [BorrowerComponent],
})
export class BorrowerModule {}
