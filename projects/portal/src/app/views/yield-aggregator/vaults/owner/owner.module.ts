import { OwnerComponent } from './owner.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [OwnerComponent],
  imports: [CommonModule, RouterModule],
  exports: [OwnerComponent],
})
export class OwnerModule {}
