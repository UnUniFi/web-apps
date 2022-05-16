import { CreateCdpFormDialogComponent } from './create-cdp-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CreateCdpFormDialogModule } from 'projects/portal/src/app/views/dialogs/mint/create-cdp-form-dialog/create-cdp-form-dialog.module';

@NgModule({
  declarations: [CreateCdpFormDialogComponent],
  imports: [CommonModule, CreateCdpFormDialogModule],
})
export class AppCreateCdpFormDialogModule {}
