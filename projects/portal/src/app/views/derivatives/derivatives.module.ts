import { MaterialModule } from '../material.module';
import { DerivativesComponent } from './derivatives.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [DerivativesComponent],
  imports: [CommonModule, RouterModule, MaterialModule,PipesModule],
  exports: [DerivativesComponent],
})
export class DerivativesModule {}
