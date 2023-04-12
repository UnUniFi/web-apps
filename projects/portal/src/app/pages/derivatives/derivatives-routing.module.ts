import { DerivativesComponent } from './derivatives.component';
import { PerpetualFuturesComponent } from './perpetual-futures/perpetual-futures.component';
import { PoolComponent } from './pool/pool.component';
import { PositionsComponent } from './positions/positions.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DerivativesComponent,
  },
  {
    path: 'pool',
    component: PoolComponent,
  },
  {
    path: 'positions',
    component: PositionsComponent,
  },
  {
    path: 'perpetual-futures',
    loadChildren: () =>
      import('./perpetual-futures/perpetual-futures.module').then(
        (m) => m.AppPerpetualFuturesModule,
      ),
  },
  {
    path: 'copy-trading',
    loadChildren: () =>
      import('../copy-trading/copy-trading.module').then((m) => m.AppCopyTradingModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DerivativesRoutingModule {}
