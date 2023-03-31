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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppDerivativesRoutingModule {}
