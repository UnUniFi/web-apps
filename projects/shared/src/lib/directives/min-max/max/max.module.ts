import { MaxDirective } from './max.directive';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MaxDirective],
  imports: [CommonModule],
  exports: [MaxDirective],
})
export class MaxModule {}
