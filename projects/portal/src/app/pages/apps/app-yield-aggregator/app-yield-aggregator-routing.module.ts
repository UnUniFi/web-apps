import { AppYieldAggregatorComponent } from './app-yield-aggregator.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppYieldAggregatorComponent,
    loadChildren: () =>
      import('../../yieldaggregator/yield-aggregator.module').then(
        (m) => m.AppYieldAggregatorModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppYieldAggregatorRoutingModule {}
