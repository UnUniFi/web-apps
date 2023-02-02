import { BorrowerComponent } from './borrower.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BorrowerComponent],
  imports: [CommonModule],
  exports: [BorrowerComponent],
})
export class BorrowerModule {}
