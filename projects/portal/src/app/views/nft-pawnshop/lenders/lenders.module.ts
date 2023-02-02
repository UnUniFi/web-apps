import { LendersComponent } from './lenders.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LendersComponent],
  imports: [CommonModule],
  exports: [LendersComponent],
})
export class LendersModule {}
