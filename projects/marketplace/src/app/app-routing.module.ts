import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.AppHomeModule),
  },
  {
    path: 'my-page',
    loadChildren: () => import('./pages/my-page/my-page.module').then((m) => m.AppMyPageModule),
  },
  {
    path: 'nfts',
    loadChildren: () => import('./pages/nfts/nfts.module').then((m) => m.AppNftsModule),
  },
  // Todo: After reference, we need to remove these resources.
  // {
  //   path: 'balance',
  //   loadChildren: () => import('./pages/balance/balance.module').then((m) => m.AppBalanceModule),
  // },
  // {
  //   path: 'assets',
  //   loadChildren: () => import('./pages/assets/assets.module').then((m) => m.AppAssetsModule),
  // },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
