import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaxDirective } from './max.directive';

@NgModule({
  declarations: [MaxDirective],
  imports: [CommonModule],
  exports: [MaxDirective],
})
export class MaxModule {}
