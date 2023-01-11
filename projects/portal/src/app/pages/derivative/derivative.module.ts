import { DerivativeModule } from '../../views/derivative/derivative.module';
import { DerivativeRoutingModule } from './derivative-routing.module';
import { DerivativeComponent } from './derivative.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DerivativeComponent],
  imports: [CommonModule, DerivativeRoutingModule, DerivativeModule],
})
export class AppDerivativeModule {}
