import { AuctionModule } from '../../views/auction/auction.module';
import { AuctionRoutingModule } from './auction-routing.module';
import { AuctionComponent } from './auction.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [AuctionComponent],
  imports: [CommonModule, AuctionRoutingModule, AuctionModule],
})
export class AppAuctionModule {}
