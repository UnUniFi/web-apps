import { CdpMenuDialogComponent } from './cdp-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdpMenuDialogModule } from 'projects/portal/src/app/views/dialogs/mint/cdp-menu-dialog/cdp-menu-dialog.module';

@NgModule({
  declarations: [CdpMenuDialogComponent],
  imports: [CommonModule, CdpMenuDialogModule],
})
export class AppCdpMenuDialogModule {}
