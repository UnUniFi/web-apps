import { BorrowModule } from '../../views/nft-pawnshop/borrowers/borrow/borrow.module';
import { BorrowerModule } from '../../views/nft-pawnshop/borrowers/borrower/borrower.module';
import { BorrowersModule } from '../../views/nft-pawnshop/borrowers/borrowers.module';
import { ListModule } from '../../views/nft-pawnshop/borrowers/list/list.module';
import { RepayModule } from '../../views/nft-pawnshop/borrowers/repay/repay.module';
import { LenderModule } from '../../views/nft-pawnshop/lenders/lender/lender.module';
import { LendersModule } from '../../views/nft-pawnshop/lenders/lenders.module';
import { PlaceBidModule } from '../../views/nft-pawnshop/lenders/place-bid/place-bid.module';
import { NftPawnshopModule } from '../../views/nft-pawnshop/nft-pawnshop.module';
import { ClassModule } from '../../views/nft-pawnshop/nfts/class/class.module';
import { NftModule } from '../../views/nft-pawnshop/nfts/class/nft/nft.module';
import { NftsModule } from '../../views/nft-pawnshop/nfts/nfts.module';
import { BorrowComponent } from './borrowers/borrow/borrow.component';
import { BorrowerComponent } from './borrowers/borrower/borrower.component';
import { BorrowersComponent } from './borrowers/borrowers.component';
import { ListComponent } from './borrowers/list/list.component';
import { RepayComponent } from './borrowers/repay/repay.component';
import { LenderComponent } from './lenders/lender/lender.component';
import { LendersComponent } from './lenders/lenders.component';
import { PlaceBidComponent } from './lenders/place-bid/place-bid.component';
import { NftPawnshopRoutingModule } from './nft-pawnshop-routing.module';
import { NftPawnshopComponent } from './nft-pawnshop.component';
import { ClassComponent } from './nfts/class/class.component';
import { NftComponent } from './nfts/class/nft/nft.component';
import { NftsComponent } from './nfts/nfts.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    NftPawnshopComponent,
    LendersComponent,
    LenderComponent,
    BorrowersComponent,
    BorrowerComponent,
    PlaceBidComponent,
    ListComponent,
    BorrowComponent,
    RepayComponent,
    NftsComponent,
    ClassComponent,
    NftComponent,
  ],
  imports: [
    CommonModule,
    NftPawnshopRoutingModule,
    NftPawnshopModule,
    LendersModule,
    LenderModule,
    BorrowersModule,
    BorrowerModule,
    PlaceBidModule,
    ListModule,
    BorrowModule,
    RepayModule,
    NftsModule,
    ClassModule,
    NftModule,
  ],
})
export class AppNftPawnshopModule {}
