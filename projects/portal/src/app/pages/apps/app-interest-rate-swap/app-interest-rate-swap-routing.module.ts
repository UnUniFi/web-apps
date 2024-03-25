import { AppInterestRateSwapComponent } from './app-interest-rate-swap.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppInterestRateSwapComponent,
    loadChildren: () =>
      import('../../interest-rate-swap/interest-rate-swap.module').then(
        (m) => m.AppInterestRateSwapModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppInterestRateSwapRoutingModule {}
