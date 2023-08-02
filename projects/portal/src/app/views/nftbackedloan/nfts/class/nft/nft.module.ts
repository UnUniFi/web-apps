import { MaterialModule } from '../../../../material.module';
import { BidderNftComponent } from './bidder-nft/bidder-nft.component';
import { ListerNftComponent } from './lister-nft/lister-nft.component';
import { NftComponent } from './nft.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [NftComponent, ListerNftComponent, BidderNftComponent],
  imports: [CommonModule, RouterModule, PipesModule, MaterialModule],
  exports: [NftComponent],
})
export class NftModule {}
