import { CreateValidatorModule } from '../../views/staking/create-validator/create-validator.module';
import { StakingModule } from '../../views/staking/staking.module';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { StakingRoutingModule } from './staking-routing.module';
import { StakingComponent } from './staking.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [CreateValidatorComponent, StakingComponent],
  imports: [CommonModule, StakingRoutingModule, StakingModule, CreateValidatorModule],
})
export class AppStakingModule {}
