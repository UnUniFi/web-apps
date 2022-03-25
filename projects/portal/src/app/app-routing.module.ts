import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./pages/home/home.module').then((m) => m.AppHomeModule) },
  {
    path: 'accounts',
    loadChildren: () => import('./pages/accounts/accounts.module').then((m) => m.AppAccountsModule),
  },
  {
    path: 'txs',
    loadChildren: () => import('./pages/txs/txs.module').then((m) => m.AppTxsModule),
  },
  {
    path: 'cosmos',
    loadChildren: () => import('./pages/cosmos/cosmos.module').then((m) => m.AppCosmosModule),
  },
  {
    path: 'keys',
    loadChildren: () => import('./pages/keys/keys.module').then((m) => m.AppKeysModule),
  },
  {
    path: 'monitor',
    loadChildren: () => import('./pages/monitor/monitor.module').then((m) => m.AppMonitorModule),
  },
  {
    path: 'faucet',
    loadChildren: () => import('./pages/faucet/faucet.module').then((m) => m.AppFaucetModule),
  },
  {
    path: 'mint',
    loadChildren: () => import('./pages/mint/mint.module').then((m) => m.AppMintModule),
  },
  {
    path: 'auction',
    loadChildren: () => import('./pages/auction/auction.module').then((m) => m.AppAuctionModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
