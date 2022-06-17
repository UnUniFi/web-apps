import { LibViewNftMenuDialogModule } from '../../../../../views/dialogs/ununifi/tx/nft/nft-menu-dialog/nft-menu-dialog.module';
import { LibWidgetNftMenuDialogComponent } from './nft-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LibWidgetNftMenuDialogComponent],
  imports: [CommonModule, LibViewNftMenuDialogModule],
  exports: [LibWidgetNftMenuDialogComponent],
})
export class LibWidgetNftMenuDialogModule {}
