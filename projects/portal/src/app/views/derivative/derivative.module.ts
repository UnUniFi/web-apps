import { MaterialModule } from '../material.module';
import { DerivativeComponent } from './derivative.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [DerivativeComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [DerivativeComponent],
})
export class DerivativeModule {}
