import { CollateralParamComponent } from './collateral-param/collateral-param.component';
import { DebtParamComponent } from './debt-param/debt-param.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'collateral/:type',
    component: CollateralParamComponent,
  },
  {
    path: 'debt/:type',
    component: DebtParamComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParamsRoutingModule {}
