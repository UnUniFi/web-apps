import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MinDirective } from './min.directive';

@NgModule({
  declarations: [MinDirective],
  imports: [CommonModule],
  exports: [MinDirective],
})
export class MinModule {}
