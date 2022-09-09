import { BlockModule } from '../../views/blocks/block/block.module';
import { BlocksModule } from '../../views/blocks/blocks.module';
import { BlockComponent } from './block/block.component';
import { BlocksRoutingModule } from './blocks-routing.module';
import { BlocksComponent } from './blocks.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [BlockComponent, BlocksComponent],
  imports: [CommonModule, BlocksRoutingModule, BlockModule, BlocksModule],
})
export class AppBlocksModule {}
