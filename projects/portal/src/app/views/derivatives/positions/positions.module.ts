import { MaterialModule } from '../../material.module';
import { PerpetualFuturesComponent } from './position/perpetual-futures/perpetual-futures.component';
import { PositionComponent } from './position/position.component';
import { PositionsComponent } from './positions.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PositionsComponent, PositionComponent, PerpetualFuturesComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule],
  exports: [PositionsComponent],
})
export class PositionsModule {}
