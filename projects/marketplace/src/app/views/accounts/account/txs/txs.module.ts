import { MaterialModule } from '../../../material.module';
import { TxsComponent } from './txs.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule as PortalMaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [TxsComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PortalMaterialModule],
  exports: [TxsComponent],
})
export class TxsModule {}
