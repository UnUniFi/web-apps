import { AccountComponent } from './account/account.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'create',
    loadChildren: () => import('./create/create.module').then((m) => m.CreateModule),
  },
  {
    path: ':address',
    component: AccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountsRoutingModule {}
