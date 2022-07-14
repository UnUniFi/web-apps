import { MaterialModule } from '../../material.module';
import { ViewEditValidatorSimpleComponent } from './edit-validator-simple.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewEditValidatorSimpleComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [ViewEditValidatorSimpleComponent],
})
export class ViewEditValidatorSimpleModule {}
