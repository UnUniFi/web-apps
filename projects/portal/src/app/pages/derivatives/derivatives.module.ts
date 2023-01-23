import { DerivativesModule } from '../../views/derivatives/derivatives.module';
import { PerpetualFuturesModule } from '../../views/derivatives/perpetual-futures/perpetual-futures.module';
import { DerivativeRoutingModule } from './derivatives-routing.module';
import { DerivativesComponent } from './derivatives.component';
import { PerpetualFuturesComponent } from './perpetual-futures/perpetual-futures.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DerivativesComponent, PerpetualFuturesComponent],
  imports: [CommonModule, DerivativeRoutingModule, DerivativesModule, PerpetualFuturesModule],
})
export class AppDerivativesModule {}
