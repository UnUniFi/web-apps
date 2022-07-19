import { MaterialModule } from '../../material.module';
import { ViewEditValidatorComponent } from './edit-validator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ViewEditValidatorComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [ViewEditValidatorComponent],
})
export class ViewEditValidatorModule {}
