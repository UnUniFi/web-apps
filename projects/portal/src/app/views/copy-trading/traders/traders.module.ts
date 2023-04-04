import { TradersComponent } from './traders.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TradersComponent],
  imports: [CommonModule],
  exports: [TradersComponent],
})
export class TradersModule {}
