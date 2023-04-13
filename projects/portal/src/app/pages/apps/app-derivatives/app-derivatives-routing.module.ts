import { AppDerivativesComponent } from './app-derivatives.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppDerivativesComponent,
    loadChildren: () =>
      import('../../derivatives/derivatives.module').then((m) => m.AppDerivativesModule),
  },
  {
    path: 'copy-trading',
    component: AppDerivativesComponent,
    loadChildren: () =>
      import('../../copy-trading/copy-trading.module').then((m) => m.AppCopyTradingModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppDerivativesRoutingModule {}
