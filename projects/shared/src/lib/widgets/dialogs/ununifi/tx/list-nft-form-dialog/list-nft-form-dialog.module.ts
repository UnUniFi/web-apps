import { LibViewListNftFormDialogModule } from '../../../../../views/dialogs/ununifi/tx/nft/list-nft-form-dialog/list-nft-form-dialog.module';
import { LibWidgetListNftFormDialogComponent } from './list-nft-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LibWidgetListNftFormDialogComponent],
  imports: [CommonModule, LibViewListNftFormDialogModule],
  exports: [LibWidgetListNftFormDialogComponent],
})
export class LibWidgetListNftFormDialogModule {}
