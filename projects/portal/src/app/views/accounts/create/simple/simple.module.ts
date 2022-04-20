import { SimpleComponent } from './simple.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [SimpleComponent],
  imports: [CommonModule],
  exports: [SimpleComponent],
})
export class ViewSimpleModule {}
