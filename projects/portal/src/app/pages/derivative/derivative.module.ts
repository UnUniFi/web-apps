import { DerivativeModule } from '../../views/derivative/derivative.module';
import { PerpetualSwapModule } from '../../views/derivative/perpetual-swap/perpetual-swap.module';
import { DerivativeRoutingModule } from './derivative-routing.module';
import { DerivativeComponent } from './derivative.component';
import { PerpetualSwapComponent } from './perpetual-swap/perpetual-swap.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DerivativeComponent, PerpetualSwapComponent],
  imports: [CommonModule, DerivativeRoutingModule, DerivativeModule, PerpetualSwapModule],
})
export class AppDerivativeModule {}
