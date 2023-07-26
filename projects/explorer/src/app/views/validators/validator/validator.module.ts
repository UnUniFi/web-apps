import { PipesModule } from '../../../../../../portal/src/app/pipes/pipes.module';
import { MaterialModule } from '../../material.module';
import { ValidatorComponent } from './validator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ValidatorComponent],
  exports: [ValidatorComponent],
  imports: [CommonModule, RouterModule, MaterialModule, MatChipsModule, PipesModule],
})
export class ValidatorModule {}
