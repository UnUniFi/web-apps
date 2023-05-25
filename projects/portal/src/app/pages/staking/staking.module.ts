import { ViewCreateValidatorMultipleModule } from '../../views/staking/create-validator-multiple/create-validator-multiple.module';
import { ViewCreateValidatorSimpleModule } from '../../views/staking/create-validator-simple/create-validator-simple.module';
import { CreateValidatorModule } from '../../views/staking/create-validator/create-validator.module';
import { ViewEditValidatorMultipleModule } from '../../views/staking/edit-validator-multiple/edit-validator-multiple.module';
import { ViewEditValidatorSimpleModule } from '../../views/staking/edit-validator-simple/edit-validator-simple.module';
import { ViewEditValidatorModule } from '../../views/staking/edit-validator/edit-validator.module';
import { StakingModule } from '../../views/staking/staking.module';
import { CreateValidatorMultipleComponent } from './create-validator-multiple/create-validator-multiple.component';
import { CreateValidatorSimpleComponent } from './create-validator-simple/create-validator-simple.component';
import { CreateValidatorComponent } from './create-validator/create-validator.component';
import { EditValidatorMultipleComponent } from './edit-validator-multiple/edit-validator-multiple.component';
import { EditValidatorSimpleComponent } from './edit-validator-simple/edit-validator-simple.component';
import { EditValidatorComponent } from './edit-validator/edit-validator.component';
import { StakingRoutingModule } from './staking-routing.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// TODO: move into model/cosmos/staking
@NgModule({
  declarations: [
    CreateValidatorComponent,
    CreateValidatorSimpleComponent,
    CreateValidatorMultipleComponent,
    EditValidatorComponent,
    EditValidatorSimpleComponent,
    EditValidatorMultipleComponent,
  ],
  imports: [
    CommonModule,
    StakingRoutingModule,
    StakingModule,
    ViewEditValidatorModule,
    ViewEditValidatorSimpleModule,
    ViewEditValidatorMultipleModule,
    CreateValidatorModule,
    ViewCreateValidatorSimpleModule,
    ViewCreateValidatorMultipleModule,
  ],
})
export class AppStakingModule {}
