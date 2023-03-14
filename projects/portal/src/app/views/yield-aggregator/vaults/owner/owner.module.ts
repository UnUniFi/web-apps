import { OwnerComponent } from './owner.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [OwnerComponent],
  imports: [CommonModule],
  exports: [OwnerComponent],
})
export class OwnerModule {}
