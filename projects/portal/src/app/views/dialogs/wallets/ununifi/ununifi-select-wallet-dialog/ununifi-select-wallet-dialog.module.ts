import { MaterialModule } from '../../../../material.module';
import { UnunifiSelectWalletDialogComponent } from './ununifi-select-wallet-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [UnunifiSelectWalletDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [UnunifiSelectWalletDialogComponent],
})
export class UnunifiSelectWalletDialogModule {}
