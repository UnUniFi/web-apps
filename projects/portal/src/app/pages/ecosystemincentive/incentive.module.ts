import { IncentiveModule } from '../../views/ecosystemincentive/incentive.module';
import { TokenModule } from '../../views/ecosystemincentive/units/unit/unit.module';
import { IncentiveRoutingModule } from './incentive-routing.module';
import { IncentiveComponent } from './incentive.component';
import { UnitComponent } from './units/unit/unit.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [IncentiveComponent, UnitComponent],
  imports: [CommonModule, IncentiveRoutingModule, IncentiveModule, TokenModule],
})
export class AppIncentiveModule {}
