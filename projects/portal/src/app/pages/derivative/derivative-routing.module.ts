import { DerivativeComponent } from './derivative.component';
import { PerpetualSwapComponent } from './perpetual-swap/perpetual-swap.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: DerivativeComponent,
  },
  {
    path: 'perpetual-swap',
    component: PerpetualSwapComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DerivativeRoutingModule {}
