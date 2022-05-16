import { CollateralMenuDialogComponent } from './collateral-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollateralMenuDialogModule } from 'projects/portal/src/app/views/dialogs/mint/collateral-menu-dialog/collateral-menu-dialog.module';

@NgModule({
  declarations: [CollateralMenuDialogComponent],
  imports: [CommonModule, CollateralMenuDialogModule],
})
export class AppCollateralMenuDialogModule {}
