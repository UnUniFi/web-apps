import { MintComponent } from './mint/mint.component';
import { NftsComponent } from './nfts.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: NftsComponent,
  },
  {
    path: 'mint',
    component: MintComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftsRoutingModule {}
