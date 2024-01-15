import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then((m) => m.AppDashboardModule),
    data: {
      animation: true,
    },
  },
  {
    path: 'accounts',
    loadChildren: () => import('./pages/accounts/accounts.module').then((m) => m.AppAccountsModule),
    data: {
      animation: true,
    },
  },
  {
    path: 'blocks',
    loadChildren: () => import('./pages/blocks/blocks.module').then((m) => m.AppBlocksModule),
    data: {
      animation: true,
    },
  },
  {
    path: 'txs',
    loadChildren: () => import('./pages/txs/txs.module').then((m) => m.AppTxsModule),
    data: {
      animation: true,
    },
  },
  {
    path: 'validators',
    loadChildren: () =>
      import('./pages/validators/validators.module').then((m) => m.AppValidatorsModule),
    data: {
      animation: true,
    },
  },
  {
    path: 'proposals',
    loadChildren: () =>
      import('./pages/proposals/proposals.module').then((m) => m.AppProposalsModule),
    data: {
      animation: true,
    },
  },
  {
    path: 'monitor',
    loadChildren: () => import('./pages/monitor/monitor.module').then((m) => m.AppMonitorModule),
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
