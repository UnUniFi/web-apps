import { SimplePoolComponent } from './simple-pool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [SimplePoolComponent],
  imports: [CommonModule],
  exports: [SimplePoolComponent],
})
export class SimplePoolModule {}
