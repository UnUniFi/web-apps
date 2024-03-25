import { PoolsComponent } from './pools.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PoolsComponent],
  imports: [CommonModule, RouterModule],
  exports: [PoolsComponent],
})
export class PoolsModule {}
