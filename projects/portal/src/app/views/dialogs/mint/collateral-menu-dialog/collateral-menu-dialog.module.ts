import { MaterialModule } from '../../../material.module';
import { CollateralMenuDialogComponent } from './collateral-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [CollateralMenuDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [CollateralMenuDialogComponent],
})
export class CollateralMenuDialogModule {}
