import { BorrowerNftComponent } from './borrowers/borrower-nfts/borrower-nft/borrower-nft.component';
import { BorrowerComponent } from './borrowers/borrower/borrower.component';
import { BorrowersComponent } from './borrowers/borrowers.component';
import { LenderNftComponent } from './lenders/lender-nfts/lender-nft/lender-nft.component';
import { PlaceBidComponent } from './lenders/lender-nfts/lender-nft/place-bid/place-bid.component';
import { LenderComponent } from './lenders/lender/lender.component';
import { LendersComponent } from './lenders/lenders.component';
import { NftPawnshopComponent } from './nft-pawnshop.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: NftPawnshopComponent,
  },
  {
    path: 'lenders',
    component: LendersComponent,
  },
  {
    path: 'lenders/lender',
    component: LenderComponent,
  },
  {
    path: 'lenders/nfts/:class_id/:nft_id',
    component: LenderNftComponent,
  },
  {
    path: 'lenders/nfts/:class_id/:nft_id/place-bid',
    component: PlaceBidComponent,
  },
  {
    path: 'borrowers',
    component: BorrowersComponent,
  },
  {
    path: 'borrowers/borrower',
    component: BorrowerComponent,
  },
  {
    path: 'borrowers/nfts/:class_id/:nft_id',
    component: BorrowerNftComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftPawnshopRoutingModule {}
