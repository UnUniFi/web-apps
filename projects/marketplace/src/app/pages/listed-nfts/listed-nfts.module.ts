import { ClassModule } from '../../views/listed-nfts/class/class.module';
import { NftModule } from '../../views/listed-nfts/class/nft/nft.module';
import { ListedNftsModule } from '../../views/listed-nfts/listed-nfts.module';
import { ClassComponent } from './class/class.component';
import { NftComponent } from './class/nft/nft.component';
import { ListedNftsRoutingModule } from './listed-nfts-routing.module';
import { ListedNftsComponent } from './listed-nfts.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ListedNftsComponent, ClassComponent, NftComponent],
  imports: [CommonModule, ListedNftsRoutingModule, ListedNftsModule, ClassModule, NftModule],
})
export class AppListedNftsModule {}
