import { MaterialModule } from '../material.module';
import { ToolbarComponent } from './toolbar.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule as PortalMaterialModule } from 'projects/portal/src/app/views/material.module';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [CommonModule, RouterModule, FormsModule, MaterialModule, PortalMaterialModule],
  exports: [ToolbarComponent],
})
export class ToolbarModule {}
