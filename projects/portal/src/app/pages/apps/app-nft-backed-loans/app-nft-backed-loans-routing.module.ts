import { AppNftBackedLoansComponent } from './app-nft-backed-loans.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: AppNftBackedLoansComponent,
    loadChildren: () =>
      import('../../nft-pawnshop/nft-pawnshop.module').then((m) => m.AppNftPawnshopModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppNftBackedLoansRoutingModule {}
