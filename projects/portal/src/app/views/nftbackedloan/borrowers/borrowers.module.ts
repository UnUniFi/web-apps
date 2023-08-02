import { BorrowersComponent } from './borrowers.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BorrowersComponent],
  imports: [CommonModule],
  exports: [BorrowersComponent],
})
export class BorrowersModule {}
