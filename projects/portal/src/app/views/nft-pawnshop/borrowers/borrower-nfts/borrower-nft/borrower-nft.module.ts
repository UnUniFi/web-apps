import { BorrowerNftComponent } from './borrower-nft.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PipesModule } from 'projects/portal/src/app/pipes/pipes.module';

@NgModule({
  declarations: [BorrowerNftComponent],
  imports: [CommonModule, RouterModule, PipesModule],
  exports: [BorrowerNftComponent],
})
export class BorrowerNftModule {}
