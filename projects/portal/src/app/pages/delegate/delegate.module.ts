import { ValidatorModule } from '../../views/delegate/validators/validator/validator.module';
import { ValidatorsModule } from '../../views/delegate/validators/validators.module';
import { DelegateRoutingModule } from './delegate-routing.module';
import { ValidatorComponent } from './validators/validator/validator.component';
import { ValidatorsComponent } from './validators/validators.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [ValidatorsComponent, ValidatorComponent],
  imports: [CommonModule, DelegateRoutingModule, ValidatorsModule, ValidatorModule],
})
export class AppDelegateModule {}
