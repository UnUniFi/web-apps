import { IncentiveModule } from '../../views/incentive/incentive.module';
import { IncentiveRoutingModule } from './incentive-routing.module';
import { IncentiveComponent } from './incentive.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [IncentiveComponent],
  imports: [CommonModule, IncentiveRoutingModule, IncentiveModule],
})
export class AppIncentiveModule {}
