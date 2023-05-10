import { MaterialModule } from '../../material.module';
import { NftsComponent } from './nfts.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [NftsComponent],
  imports: [CommonModule, MaterialModule, RouterModule, FormsModule],
  exports: [NftsComponent],
})
export class NftsModule {}
