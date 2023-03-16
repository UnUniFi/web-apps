import { MaterialModule } from '../material.module';
import { ListedNftsComponent } from './listed-nfts.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ListedNftsComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [ListedNftsComponent],
})
export class ListedNftsModule {}
