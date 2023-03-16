import { ClassComponent } from './class/class.component';
import { NftComponent } from './class/nft/nft.component';
import { ListedNftsComponent } from './listed-nfts.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: ListedNftsComponent },
  { path: ':class_id', component: ClassComponent },
  { path: ':class_id/:nft_id', component: NftComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListedNftsRoutingModule {}
