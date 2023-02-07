import { ListComponent } from './list.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule],
  exports: [ListComponent],
})
export class ListModule {}
