import { IncentiveModule } from '../../views/incentive/incentive.module';
import { IncentiveComponent } from './incentive.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [IncentiveComponent],
  imports: [CommonModule, IncentiveModule],
})
export class AppIncentiveModule {}
