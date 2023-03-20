import { MaterialModule } from '../../material.module';
import { PoolComponent } from './pool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../../pipes/pipes.module';

@NgModule({
  declarations: [PoolComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule,PipesModule],
  exports: [PoolComponent],
})
export class PoolModule {}
