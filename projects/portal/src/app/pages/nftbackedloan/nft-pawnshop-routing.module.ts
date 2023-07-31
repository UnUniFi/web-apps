import { WalletGuard } from '../../models/wallets/wallet.guard';
import { BorrowComponent } from './borrowers/borrow/borrow.component';
import { BorrowerComponent } from './borrowers/borrower/borrower.component';
import { BorrowersComponent } from './borrowers/borrowers.component';
import { ListComponent } from './borrowers/list/list.component';
import { RepayComponent } from './borrowers/repay/repay.component';
import { LenderComponent } from './lenders/lender/lender.component';
import { LendersComponent } from './lenders/lenders.component';
import { PlaceBidComponent } from './lenders/place-bid/place-bid.component';
import { NftPawnshopComponent } from './nft-pawnshop.component';
import { NftComponent } from './nfts/class/nft/nft.component';
import { NftsComponent } from './nfts/nfts.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: NftPawnshopComponent,
  },
  {
    path: 'nfts',
    component: NftsComponent,
  },
  {
    path: 'nfts/:class_id/:nft_id',
    component: NftComponent,
  },
  {
    path: 'nfts/:class_id/:nft_id/list',
    component: ListComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'nfts/:class_id/:nft_id/borrow',
    component: BorrowComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'nfts/:class_id/:nft_id/repay',
    component: RepayComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'nfts/:class_id/:nft_id/place-bid',
    component: PlaceBidComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'lenders',
    component: LendersComponent,
  },
  {
    path: 'lenders/lender',
    component: LenderComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'borrowers',
    component: BorrowersComponent,
  },
  {
    path: 'borrowers/borrower',
    component: BorrowerComponent,
    canActivate: [WalletGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftPawnshopRoutingModule {}
