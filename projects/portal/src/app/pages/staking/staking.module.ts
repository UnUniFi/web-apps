import { CreateValidatorModule } from '../../views/staking/create-validator/create-validator.module';
import { SimpleModule } from '../../views/staking/create-validator/simple/simple.module';
import { StakingModule } from '../../views/staking/staking.module';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { SimpleComponent } from './create-validator/simple/simple.component';
import { StakingRoutingModule } from './staking-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [CreateValidatorComponent, SimpleComponent],
  imports: [CommonModule, StakingRoutingModule, CreateValidatorModule, StakingModule, SimpleModule],
})
export class AppStakingModule {}
