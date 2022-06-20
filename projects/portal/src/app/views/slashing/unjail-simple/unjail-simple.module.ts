import { MaterialModule } from '../../material.module';
import { UnjailSimpleComponent } from './unjail-simple.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UnjailSimpleComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [UnjailSimpleComponent],
})
export class UnjailSimpleModule {}
