import { CreateComponent } from './traders/create/create.component';
import { TraderComponent } from './traders/trader/trader.component';
import { TradersComponent } from './traders/traders.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'traders',
    component: TradersComponent,
  },
  {
    path: 'traders/:address',
    component: TraderComponent,
  },
  {
    path: 'traders/create',
    component: CreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CopyTradingRoutingModule {}
