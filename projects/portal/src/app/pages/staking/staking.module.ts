import { ViewCreateValidatorSimpleModule } from '../../views/staking/create-validator-simple/create-validator-simple.module';
import { CreateValidatorModule } from '../../views/staking/create-validator/create-validator.module';
import { ViewEditValidatorSimpleModule } from '../../views/staking/edit-validator-simple/edit-validator-simple.module';
import { ViewEditValidatorModule } from '../../views/staking/edit-validator/edit-validator.module';
import { StakingModule } from '../../views/staking/staking.module';
import { CreateValidatorSimpleComponent } from './create-validator-simple/create-validator-simple.component';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { EditValidatorSimpleComponent } from './edit-validator-simple/edit-validator-simple.component';
import { EditValidatorComponent } from './edit-validator/edit-validator.component';
import { StakingRoutingModule } from './staking-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    CreateValidatorComponent,
    CreateValidatorSimpleComponent,
    EditValidatorSimpleComponent,
    EditValidatorComponent,
  ],
  imports: [
    CommonModule,
    StakingRoutingModule,
    CreateValidatorModule,
    StakingModule,
    ViewCreateValidatorSimpleModule,
    ViewEditValidatorModule,
    ViewEditValidatorSimpleModule,
  ],
})
export class AppStakingModule {}
