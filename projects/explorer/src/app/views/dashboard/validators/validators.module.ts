import { MaterialModule } from '../../material.module';
import { ValidatorsComponent } from './validators.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [ValidatorsComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PipesModule],
  exports: [ValidatorsComponent],
})
export class ValidatorsModule {}
