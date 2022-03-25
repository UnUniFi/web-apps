import { MaterialModule } from '../../../../material.module';
import { BidComponent as PlaceBidComponent } from './place-bid.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PlaceBidComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [PlaceBidComponent],
})
export class PlaceBidModule {}
