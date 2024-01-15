import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/utilities', pathMatch: 'full' },
  {
    path: 'utilities',
    loadChildren: () =>
      import('./pages/apps/app-utils/app-utils.module').then((m) => m.AppAppUtilsModule),
    data: {
      animation: true,
    },
  },
  {
    path: 'nft-backed-loan',
    loadChildren: () =>
      import('./pages/apps/app-nft-backed-loans/app-nft-backed-loans.module').then(
        (m) => m.AppAppNftBackedLoansModule,
      ),
    data: {
      animation: true,
    },
  },
  {
    path: 'derivatives',
    loadChildren: () =>
      import('./pages/apps/app-derivatives/app-derivatives.module').then(
        (m) => m.AppAppDerivativesModule,
      ),
    data: {
      animation: true,
    },
  },
  {
    path: 'yield-aggregator',
    loadChildren: () =>
      import('./pages/apps/app-yield-aggregator/app-yield-aggregator.module').then(
        (m) => m.AppAppYieldAggregatorModule,
      ),
    data: {
      animation: true,
    },
  },
  {
    path: 'interest-rate-swap',
    loadChildren: () =>
      import('./pages/apps/app-interest-rate-swap/app-interest-rate-swap.module').then(
        (m) => m.AppAppInterestRateSwapModule,
      ),
    data: {
      animation: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
