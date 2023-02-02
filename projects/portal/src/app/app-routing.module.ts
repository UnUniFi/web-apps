import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/balance/balance.module').then((m) => m.AppBalanceModule),
  },
  {
    path: 'balance',
    loadChildren: () => import('./pages/balance/balance.module').then((m) => m.AppBalanceModule),
  },
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
  {
    path: 'staking',
    loadChildren: () => import('./pages/staking/staking.module').then((m) => m.AppStakingModule),
  },
  {
    path: 'slashing',
    loadChildren: () => import('./pages/slashing/slashing.module').then((m) => m.AppSlashingModule),
  },
  {
    path: 'delegate',
    loadChildren: () => import('./pages/delegate/delegate.module').then((m) => m.AppDelegateModule),
  },
  {
    path: 'vote',
    loadChildren: () => import('./pages/vote/vote.module').then((m) => m.AppVoteModule),
  },
  // {
  //   path: 'incentive',
  //   loadChildren: () =>
  //     import('./pages/incentive/incentive.module').then((m) => m.AppIncentiveModule),
  // },
  {
    path: 'nft-pawnshop',
    loadChildren: () =>
      import('./pages/nft-pawnshop/nft-pawnshop.module').then((m) => m.AppNftPawnshopModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
