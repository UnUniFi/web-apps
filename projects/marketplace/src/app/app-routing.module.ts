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
    path: 'listed-nfts',
    loadChildren: () =>
      import('./pages/listed-nfts/listed-nfts.module').then((m) => m.AppListedNftsModule),
  },
  {
    path: 'my-nfts',
    loadChildren: () => import('./pages/my-nfts/my-nfts.module').then((m) => m.AppMyNftsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
