import { MaterialModule } from '../../../material.module';
import { NftsDialogComponent } from './nfts-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [NftsDialogComponent],
  imports: [CommonModule, MaterialModule],
  exports: [NftsDialogComponent],
})
export class NftsDialogModule {}
