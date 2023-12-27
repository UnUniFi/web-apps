import { SimplePoolComponent } from './simple-pool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SimplePoolComponent],
  imports: [CommonModule, RouterModule, FormsModule],
  exports: [SimplePoolComponent],
})
export class SimplePoolModule {}
