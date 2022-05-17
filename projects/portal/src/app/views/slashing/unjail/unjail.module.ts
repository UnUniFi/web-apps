import { MaterialModule } from '../../material.module';
import { UnjailComponent } from './unjail.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnjailComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [UnjailComponent],
})
export class UnjailModule {}
