import { PoolComponent } from './pool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PoolComponent],
  imports: [CommonModule, RouterModule],
  exports: [PoolComponent],
})
export class PoolModule {}
