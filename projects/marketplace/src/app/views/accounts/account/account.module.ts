import { MaterialModule } from '../../material.module';
import { AccountComponent } from './account.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule as PortalMaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [AccountComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PortalMaterialModule],
  exports: [AccountComponent],
})
export class AccountModule {}
