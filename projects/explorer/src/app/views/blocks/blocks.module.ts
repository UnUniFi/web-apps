import { MaterialModule } from '../material.module';
import { BlocksComponent } from './blocks.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BlocksComponent],
  imports: [CommonModule, MaterialModule, RouterModule],
  exports: [BlocksComponent],
})
export class BlocksModule {}
