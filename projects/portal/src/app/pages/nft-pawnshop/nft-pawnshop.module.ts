import { BorrowerNftModule } from '../../views/nft-pawnshop/borrowers/borrower-nfts/borrower-nft/borrower-nft.module';
import { BorrowerModule } from '../../views/nft-pawnshop/borrowers/borrower/borrower.module';
import { BorrowersModule } from '../../views/nft-pawnshop/borrowers/borrowers.module';
import { LenderNftModule } from '../../views/nft-pawnshop/lenders/lender-nfts/lender-nft/lender-nft.module';
import { PlaceBidModule } from '../../views/nft-pawnshop/lenders/lender-nfts/lender-nft/place-bid/place-bid.module';
import { LenderModule } from '../../views/nft-pawnshop/lenders/lender/lender.module';
import { LendersModule } from '../../views/nft-pawnshop/lenders/lenders.module';
import { NftPawnshopModule } from '../../views/nft-pawnshop/nft-pawnshop.module';
import { BorrowerNftComponent } from './borrowers/borrower-nfts/borrower-nft/borrower-nft.component';
import { BorrowerComponent } from './borrowers/borrower/borrower.component';
import { BorrowersComponent } from './borrowers/borrowers.component';
import { LenderNftComponent } from './lenders/lender-nfts/lender-nft/lender-nft.component';
import { PlaceBidComponent } from './lenders/lender-nfts/lender-nft/place-bid/place-bid.component';
import { LenderComponent } from './lenders/lender/lender.component';
import { LendersComponent } from './lenders/lenders.component';
import { NftPawnshopRoutingModule } from './nft-pawnshop-routing.module';
import { NftPawnshopComponent } from './nft-pawnshop.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    NftPawnshopComponent,
    LendersComponent,
    LenderComponent,
    LenderNftComponent,
    BorrowersComponent,
    BorrowerComponent,
    BorrowerNftComponent,
    PlaceBidComponent,
  ],
  imports: [
    CommonModule,
    NftPawnshopRoutingModule,
    NftPawnshopModule,
    LendersModule,
    LenderModule,
    LenderNftModule,
    BorrowersModule,
    BorrowerModule,
    BorrowerNftModule,
    PlaceBidModule,
  ],
})
export class AppNftPawnshopModule {}
