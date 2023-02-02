import { MaterialModule } from '../../material.module';
import { PoolComponent } from './pool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PoolComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [PoolComponent],
})
export class PoolModule {}
