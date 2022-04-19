import { MaterialModule } from '../../../material.module';
import { ValidatorComponent } from './validator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ValidatorComponent],
  imports: [CommonModule, RouterModule, MaterialModule, MatChipsModule],
  exports: [ValidatorComponent],
})
export class ValidatorModule {}
