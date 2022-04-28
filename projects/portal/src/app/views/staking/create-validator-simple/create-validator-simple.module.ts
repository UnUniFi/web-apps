import { MaterialModule } from '../../material.module';
import { CreateValidatorSimpleComponent } from './create-validator-simple.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateValidatorSimpleComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [CreateValidatorSimpleComponent],
})
export class ViewCreateValidatorSimpleModule {}
