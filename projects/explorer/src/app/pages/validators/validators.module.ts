import { ValidatorModule } from '../../views/validators/validator/validator.module';
import { ValidatorsModule } from '../../views/validators/validators.module';
import { ValidatorComponent } from './validator/validator.component';
import { ValidatorsRoutingModule } from './validators-routing.module';
import { ValidatorsComponent } from './validators.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ValidatorsComponent, ValidatorComponent],
  imports: [CommonModule, ValidatorsRoutingModule, ValidatorsModule, ValidatorModule],
})
export class AppValidatorsModule {}
