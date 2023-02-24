import { MaterialModule } from '../../../material.module';
import { ValidatorComponent } from './validator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [ValidatorComponent],
  imports: [CommonModule, RouterModule, MaterialModule, MatChipsModule, PipesModule],
  exports: [ValidatorComponent],
})
export class ValidatorModule {}
