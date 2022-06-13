import { MaterialModule } from '../material.module';
import { ViewBalanceComponent } from './balance.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule as PortalMaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [ViewBalanceComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PortalMaterialModule],
  exports: [ViewBalanceComponent],
})
export class ViewBalanceModule {}
