import { TradersComponent } from './traders.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TradersComponent],
  imports: [CommonModule, RouterModule],
  exports: [TradersComponent],
})
export class TradersModule {}
