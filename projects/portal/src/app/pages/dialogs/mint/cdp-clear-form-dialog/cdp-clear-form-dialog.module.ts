import { CdpClearFormDialogComponent } from './cdp-clear-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdpClearFormDialogModule } from 'projects/portal/src/app/views/dialogs/mint/cdp-clear-form-dialog/cdp-clear-form-dialog.module';

@NgModule({
  declarations: [CdpClearFormDialogComponent],
  imports: [CommonModule, CdpClearFormDialogModule],
})
export class AppCdpClearFormDialogModule {}
