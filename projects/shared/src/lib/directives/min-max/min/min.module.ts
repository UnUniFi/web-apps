import { MinDirective } from './min.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MinDirective],
  imports: [CommonModule],
  exports: [MinDirective],
})
export class MinModule {}
