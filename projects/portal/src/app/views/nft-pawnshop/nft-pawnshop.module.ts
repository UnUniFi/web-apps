import { NftPawnshopComponent } from './nft-pawnshop.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'projects/explorer/src/app/views/material.module';

@NgModule({
  declarations: [NftPawnshopComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [NftPawnshopComponent],
})
export class NftPawnshopModule {}
