import { PipesModule } from '../../pipes/pipes.module';
import { MaterialModule } from '../material.module';
import { AuctionComponent } from './auction.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [AuctionComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, PipesModule],
  exports: [AuctionComponent],
})
export class AuctionModule {}
