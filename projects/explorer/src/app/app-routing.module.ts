import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then((m) => m.AppHomeModule) },
  {
    path: 'accounts',
    loadChildren: () => import('./pages/accounts/accounts.module').then((m) => m.AppAccountsModule),
  },
  {
    path: 'blocks',
    loadChildren: () => import('./pages/blocks/blocks.module').then((m) => m.AppBlocksModule),
  },
  {
    path: 'txs',
    loadChildren: () => import('./pages/txs/txs.module').then((m) => m.AppTxsModule),
  },
  {
    path: 'validators',
    loadChildren: () =>
      import('./pages/validators/validators.module').then((m) => m.AppValidatorsModule),
  },
  {
    path: 'proposals',
    loadChildren: () =>
      import('./pages/proposals/proposals.module').then((m) => m.AppProposalsModule),
  },
  {
    path: 'cosmos',
    loadChildren: () => import('./pages/cosmos/cosmos.module').then((m) => m.AppCosmosModule),
  },
  {
    path: 'monitor',
    loadChildren: () => import('./pages/monitor/monitor.module').then((m) => m.AppMonitorModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
