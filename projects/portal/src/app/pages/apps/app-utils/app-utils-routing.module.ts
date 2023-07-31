import { AppUtilsComponent } from './app-utils.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppUtilsComponent,
    loadChildren: () => import('../../balance/balance.module').then((m) => m.AppBalanceModule),
  },
  {
    path: 'accounts',
    component: AppUtilsComponent,
    loadChildren: () => import('../../accounts/accounts.module').then((m) => m.AppAccountsModule),
  },
  {
    path: 'txs',
    component: AppUtilsComponent,
    loadChildren: () => import('../../txs/txs.module').then((m) => m.AppTxsModule),
  },
  {
    path: 'cosmos',
    component: AppUtilsComponent,
    loadChildren: () => import('../../cosmos/cosmos.module').then((m) => m.AppCosmosModule),
  },
  {
    path: 'keys',
    component: AppUtilsComponent,
    loadChildren: () => import('../../keys/keys.module').then((m) => m.AppKeysModule),
  },
  {
    path: 'monitor',
    component: AppUtilsComponent,
    loadChildren: () => import('../../monitor/monitor.module').then((m) => m.AppMonitorModule),
  },
  {
    path: 'faucet',
    component: AppUtilsComponent,
    loadChildren: () => import('../../faucet/faucet.module').then((m) => m.AppFaucetModule),
  },
  {
    path: 'staking',
    component: AppUtilsComponent,
    loadChildren: () => import('../../staking/staking.module').then((m) => m.AppStakingModule),
  },
  {
    path: 'slashing',
    component: AppUtilsComponent,
    loadChildren: () => import('../../slashing/slashing.module').then((m) => m.AppSlashingModule),
  },
  {
    path: 'delegate',
    component: AppUtilsComponent,
    loadChildren: () => import('../../delegate/delegate.module').then((m) => m.AppDelegateModule),
  },
  {
    path: 'vote',
    component: AppUtilsComponent,
    loadChildren: () => import('../../vote/vote.module').then((m) => m.AppVoteModule),
  },
  {
    path: 'incentive',
    component: AppUtilsComponent,
    loadChildren: () =>
      import('../../ecosystemincentive/incentive.module').then((m) => m.AppIncentiveModule),
  },
  {
    path: 'nfts',
    component: AppUtilsComponent,
    loadChildren: () => import('../../nftfactory/nfts.module').then((m) => m.AppNftsModule),
  },
  {
    path: 'developers',
    component: AppUtilsComponent,
    loadChildren: () =>
      import('../../developers/developers.module').then((m) => m.AppDevelopersModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppUtilsRoutingModule {}
