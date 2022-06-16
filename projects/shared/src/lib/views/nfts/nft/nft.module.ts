import { MaterialModule } from '../../material.module';
import { LibViewNftComponent } from './nft.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LibViewNftComponent],
  imports: [CommonModule, RouterModule, MaterialModule],
  exports: [LibViewNftComponent],
})
export class LibViewNftModule {}
