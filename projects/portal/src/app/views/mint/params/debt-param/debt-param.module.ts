import { MaterialModule } from '../../../material.module';
import { DebtParamComponent } from './debt-param.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DebtParamComponent],
  imports: [CommonModule, MaterialModule],
  exports: [DebtParamComponent],
})
export class DebtParamModule {}
