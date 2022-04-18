import { MaterialModule } from '../../../material.module';
import { DelegateMenuDialogComponent } from './delegate-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [DelegateMenuDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [DelegateMenuDialogComponent],
})
export class DelegateMenuDialogModule {}
