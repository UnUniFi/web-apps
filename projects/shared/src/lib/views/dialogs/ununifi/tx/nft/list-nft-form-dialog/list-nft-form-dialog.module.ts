import { MaterialModule } from '../../../../../material.module';
import { LibViewListNftFormDialogComponent } from './list-nft-form-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LibViewListNftFormDialogComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  exports: [LibViewListNftFormDialogComponent],
})
export class LibViewListNftFormDialogModule {}
