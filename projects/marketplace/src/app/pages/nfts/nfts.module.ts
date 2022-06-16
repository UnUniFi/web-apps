import { NftsRoutingModule } from './nfts-routing.module';
import { NftsComponent } from './nfts.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LibViewNftsModule } from 'shared';

@NgModule({
  declarations: [NftsComponent],
  imports: [CommonModule, NftsRoutingModule, LibViewNftsModule],
  exports: [NftsComponent],
})
export class AppNftsModule {}
