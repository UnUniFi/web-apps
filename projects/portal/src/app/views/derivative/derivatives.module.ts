import { MaterialModule } from '../material.module';
import { DerivativesComponent } from './derivatives.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DerivativesComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [DerivativesComponent],
})
export class DerivativesModule {}
