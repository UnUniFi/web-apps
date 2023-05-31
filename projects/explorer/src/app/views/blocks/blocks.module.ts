import { MaterialModule } from '../material.module';
import { BlocksComponent } from './blocks.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [BlocksComponent],
  imports: [CommonModule, MaterialModule, RouterModule, FormsModule],
  exports: [BlocksComponent],
})
export class BlocksModule {}
