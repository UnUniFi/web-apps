import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/utilities', pathMatch: 'full' },
  {
    path: 'utilities',
    loadChildren: () =>
      import('./pages/apps/app-utils/app-utils.module').then((m) => m.AppAppUtilsModule),
  },
  {
    path: 'nft-backed-loan',
    loadChildren: () =>
      import('./pages/apps/app-nft-backed-loans/app-nft-backed-loans.module').then(
        (m) => m.AppAppNftBackedLoansModule,
      ),
  },
  {
    path: 'derivatives',
    loadChildren: () =>
      import('./pages/apps/app-derivatives/app-derivatives.module').then(
        (m) => m.AppAppDerivativesModule,
      ),
  },
  {
    path: 'yield-aggregator',
    loadChildren: () =>
      import('./pages/apps/app-yield-aggregator/app-yield-aggregator.module').then(
        (m) => m.AppAppYieldAggregatorModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
