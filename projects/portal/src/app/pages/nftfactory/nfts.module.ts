import { MintModule } from '../../views/nftfactory/mint/mint.module';
import { NftsModule } from '../../views/nftfactory/nfts.module';
import { MintComponent } from './mint/mint.component';
import { NftsRoutingModule } from './nfts-routing.module';
import { NftsComponent } from './nfts.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [NftsComponent, MintComponent],
  imports: [CommonModule, NftsRoutingModule, NftsModule, MintModule],
})
export class AppNftsModule {}
