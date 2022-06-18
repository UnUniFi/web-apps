import { MaterialModule } from '../../../../../material.module';
import { LibViewNftMenuDialogComponent } from './nft-menu-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [LibViewNftMenuDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [LibViewNftMenuDialogComponent],
})
export class LibViewNftMenuDialogModule {}
