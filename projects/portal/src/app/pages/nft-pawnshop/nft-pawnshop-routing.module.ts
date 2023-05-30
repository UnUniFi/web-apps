import { WalletGuard } from '../../models/wallets/wallet.guard';
import { BorrowComponent } from './borrowers/borrower-nfts/borrower-nft/borrow/borrow.component';
import { BorrowerNftComponent } from './borrowers/borrower-nfts/borrower-nft/borrower-nft.component';
import { ListComponent } from './borrowers/borrower-nfts/borrower-nft/list/list.component';
import { RepayComponent } from './borrowers/borrower-nfts/borrower-nft/repay/repay.component';
import { BorrowerComponent } from './borrowers/borrower/borrower.component';
import { BorrowersComponent } from './borrowers/borrowers.component';
import { LenderNftComponent } from './lenders/lender-nfts/lender-nft/lender-nft.component';
import { PlaceBidComponent } from './lenders/lender-nfts/lender-nft/place-bid/place-bid.component';
import { LenderComponent } from './lenders/lender/lender.component';
import { LendersComponent } from './lenders/lenders.component';
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
    path: 'lenders/nfts/:class_id/:nft_id',
    component: LenderNftComponent,
  },
  {
    path: 'lenders/nfts/:class_id/:nft_id/place-bid',
    component: PlaceBidComponent,
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
  {
    path: 'borrowers/nfts/:class_id/:nft_id',
    component: BorrowerNftComponent,
  },
  {
    path: 'borrowers/nfts/:class_id/:nft_id/list',
    component: ListComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'borrowers/nfts/:class_id/:nft_id/borrow',
    component: BorrowComponent,
    canActivate: [WalletGuard],
  },
  {
    path: 'borrowers/nfts/:class_id/:nft_id/repay',
    component: RepayComponent,
    canActivate: [WalletGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NftPawnshopRoutingModule {}
