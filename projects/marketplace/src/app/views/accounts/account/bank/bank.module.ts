import { MaterialModule } from '../../../material.module';
import { BankComponent } from './bank.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule as PortalMaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [BankComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PortalMaterialModule],
  exports: [BankComponent],
})
export class BankModule {}
