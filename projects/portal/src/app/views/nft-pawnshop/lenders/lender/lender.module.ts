import { MaterialModule } from '../../../material.module';
import { LenderComponent } from './lender.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LenderComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [LenderComponent],
})
export class LenderModule {}
