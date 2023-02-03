import { MarketComponent } from './market/market.component';
import { PerpetualFuturesComponent } from './perpetual-futures.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: PerpetualFuturesComponent,
    children: [
      {
        path: ':baseSymbol/:quoteSymbol',
        component: MarketComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerpetualFuturesRoutingModule {}
