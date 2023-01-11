import { MaterialModule } from '../../material.module';
import { PerpetualSwapComponent } from './perpetual-swap.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PerpetualSwapComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [PerpetualSwapComponent],
})
export class PerpetualSwapModule {}
