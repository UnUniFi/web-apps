import { MaterialModule } from '../../material.module';
import { PerpetualFuturesComponent } from './perpetual-futures.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PerpetualFuturesComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [PerpetualFuturesComponent],
})
export class PerpetualFuturesModule {}
