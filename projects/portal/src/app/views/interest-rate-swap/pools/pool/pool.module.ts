import { PoolComponent } from './pool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [PoolComponent],
  imports: [CommonModule, RouterModule, FormsModule, PipesModule],
  exports: [PoolComponent],
})
export class PoolModule {}
