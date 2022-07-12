import { MaterialModule } from '../material.module';
import { LibViewNftModule } from './nft/nft.module';
import { LibViewNftsComponent } from './nfts.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LibViewNftsComponent],
  imports: [CommonModule, MaterialModule, LibViewNftModule],
  exports: [LibViewNftsComponent],
})
export class LibViewNftsModule {}
