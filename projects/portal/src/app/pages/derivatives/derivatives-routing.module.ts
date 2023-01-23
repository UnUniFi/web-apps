import { DerivativesComponent } from './derivatives.component';
import { PerpetualFuturesComponent } from './perpetual-futures/perpetual-futures.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DerivativesComponent,
  },
  {
    path: 'perpetual-futures',
    component: PerpetualFuturesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DerivativeRoutingModule {}
