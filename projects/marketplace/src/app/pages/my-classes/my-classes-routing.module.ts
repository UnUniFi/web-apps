import { MyClassComponent } from './my-class/my-class.component';
import { MyNftComponent } from './my-class/my-nft/my-nft.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: ':class_id', component: MyClassComponent },
  { path: ':class_id/:nft_id', component: MyNftComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyClassesRoutingModule {}
