import { ViewCreateValidatorSimpleModule } from '../../views/staking/create-validator-simple/create-validator-simple.module';
import { CreateValidatorModule } from '../../views/staking/create-validator/create-validator.module';
import { StakingModule } from '../../views/staking/staking.module';
import { CreateValidatorSimpleComponent } from './create-validator-simple/create-validator-simple.component';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { StakingRoutingModule } from './staking-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [CreateValidatorComponent, CreateValidatorSimpleComponent],
  imports: [
    CommonModule,
    StakingRoutingModule,
    CreateValidatorModule,
    StakingModule,
    ViewCreateValidatorSimpleModule,
  ],
})
export class AppStakingModule {}
