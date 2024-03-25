import { PositionsComponent } from './positions.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [PositionsComponent],
  imports: [CommonModule, RouterModule],
  exports: [PositionsComponent],
})
export class PositionsModule {}
