import { CreateValidatorModule } from '../../views/staking/create-validator/create-validator.module';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { StakingRoutingModule } from './staking-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [CreateValidatorComponent],
  imports: [CommonModule, StakingRoutingModule, CreateValidatorModule],
})
export class AppStakingModule {}
