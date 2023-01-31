import { MyNftModule } from '../../views/my-nfts/my-class/my-nft/my-nft.module';
import { MyNftComponent } from './my-class/my-nft/my-nft.component';
import { MyNftsRoutingModule } from './my-nfts-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [MyNftComponent],
  imports: [CommonModule, MyNftsRoutingModule, MyNftModule],
})
export class AppMyNftsModule {}
