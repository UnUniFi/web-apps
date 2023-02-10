import { BorrowerComponent } from './borrower.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BorrowerComponent],
  imports: [CommonModule, RouterModule],
  exports: [BorrowerComponent],
})
export class BorrowerModule {}
