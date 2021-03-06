import { KeySelectGuard } from '../../models/keys/key-select.guard';
import { MintComponent } from './mint.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: MintComponent,
  },
  {
    path: 'cdps',
    loadChildren: () => import('./cdps/cdps.module').then((mod) => mod.AppCdpsModule),
    canActivate: [KeySelectGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MintRoutingModule {}
