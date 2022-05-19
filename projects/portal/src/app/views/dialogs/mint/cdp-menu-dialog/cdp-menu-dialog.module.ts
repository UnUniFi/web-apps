import { CdpMenuDialogComponent } from './cdp-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'projects/explorer/src/app/views/material.module';

@NgModule({
  declarations: [CdpMenuDialogComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [CdpMenuDialogComponent],
})
export class CdpMenuDialogModule {}
