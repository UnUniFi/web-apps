import { NftsDialogComponent } from './nfts-dialog.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NftsDialogModule } from 'projects/portal/src/app/views/dialogs/nft-pawnshop/nfts-dialog/nfts-dialog.module';

@NgModule({
  declarations: [NftsDialogComponent],
  imports: [CommonModule, NftsDialogModule],
})
export class AppNftsDialogModule {}
