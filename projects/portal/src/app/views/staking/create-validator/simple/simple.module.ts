import { MaterialModule } from '../../../material.module';
import { SimpleComponent } from './simple.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [SimpleComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [SimpleComponent],
})
export class SimpleModule {}
