import { DelegateModule } from '../../views/delegate/delegate.module';
import { ValidatorModule } from '../../views/delegate/validator/validator.module';
import { DelegateRoutingModule } from './delegate-routing.module';
import { DelegateComponent } from './delegate.component';
import { ValidatorComponent } from './validator/validator.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DelegateComponent, ValidatorComponent],
  imports: [CommonModule, DelegateRoutingModule, DelegateModule, ValidatorModule],
})
export class AppDelegateModule {}
