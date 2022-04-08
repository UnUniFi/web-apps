import { CreateValidatorModule } from '../../views/cosmos/staking/create-validator/create-validator.module';
import { StakingModule } from '../../views/cosmos/staking/staking.module';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { StakingRoutingModule } from './staking-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [CreateValidatorComponent],
  imports: [CommonModule, StakingRoutingModule, StakingModule, CreateValidatorModule],
})
export class AppStakingModule {}
