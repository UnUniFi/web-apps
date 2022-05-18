import { CdpMenuDialogComponent } from './cdp-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'projects/explorer/src/app/views/material.module';

@NgModule({
  declarations: [CdpMenuDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [CdpMenuDialogComponent],
})
export class CdpMenuDialogModule {}
