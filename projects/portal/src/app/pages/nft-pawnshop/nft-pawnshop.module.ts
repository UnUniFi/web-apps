import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NftPawnshopRoutingModule } from './nft-pawnshop-routing.module';
import { NftPawnshopComponent } from './nft-pawnshop.component';


@NgModule({
  declarations: [
    NftPawnshopComponent
  ],
  imports: [
    CommonModule,
    NftPawnshopRoutingModule
  ]
})
export class NftPawnshopModule { }
