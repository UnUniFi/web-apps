import { DerivativesModule } from '../../views/derivatives/derivatives.module';
import { PoolModule } from '../../views/derivatives/pool/pool.module';
import { PositionsModule } from '../../views/derivatives/positions/positions.module';
import { DerivativesRoutingModule } from './derivatives-routing.module';
import { DerivativesComponent } from './derivatives.component';
import { PoolComponent } from './pool/pool.component';
import { PositionsComponent } from './positions/positions.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DerivativesComponent, PositionsComponent, PoolComponent],
  imports: [CommonModule, DerivativesRoutingModule, DerivativesModule, PoolModule, PositionsModule],
})
export class AppDerivativesModule {}
