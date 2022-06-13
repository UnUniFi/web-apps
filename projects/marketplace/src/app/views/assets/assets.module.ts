import { MaterialModule } from '../material.module';
import { AssetsComponent } from './assets.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule as PortalMaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [AssetsComponent],
  imports: [CommonModule, RouterModule, MaterialModule, PortalMaterialModule],
  exports: [AssetsComponent],
})
export class AssetsModule {}
