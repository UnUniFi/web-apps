import { MaterialModule } from '../../../material.module';
import { CreateCdpFormDialogComponent } from './create-cdp-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CreateCdpFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [CreateCdpFormDialogComponent],
})
export class CreateCdpFormDialogModule {}
