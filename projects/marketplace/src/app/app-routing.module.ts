import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/assets/assets.module').then((m) => m.AppAssetsModule),
  },
  {
    path: 'balance',
    loadChildren: () => import('./pages/balance/balance.module').then((m) => m.AppBalanceModule),
  },
  {
    path: 'assets',
    loadChildren: () => import('./pages/assets/assets.module').then((m) => m.AppAssetsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
