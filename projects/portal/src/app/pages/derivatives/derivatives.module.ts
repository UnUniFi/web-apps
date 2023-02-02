import { DerivativesModule } from '../../views/derivatives/derivatives.module';
import { PerpetualFuturesModule } from '../../views/derivatives/perpetual-futures/perpetual-futures.module';
import { PoolModule } from '../../views/derivatives/pool/pool.module';
import { PositionsModule } from '../../views/derivatives/positions/positions.module';
import { DerivativeRoutingModule } from './derivatives-routing.module';
import { DerivativesComponent } from './derivatives.component';
import { PerpetualFuturesComponent } from './perpetual-futures/perpetual-futures.component';
import { PositionsComponent } from './positions/positions.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PoolComponent } from './pool/pool.component';

@NgModule({
  declarations: [DerivativesComponent, PerpetualFuturesComponent, PositionsComponent, PoolComponent],
  imports: [
    CommonModule,
    DerivativeRoutingModule,
    DerivativesModule,
    PerpetualFuturesModule,
    PoolModule,
    PositionsModule,
  ],
})
export class AppDerivativesModule {}
