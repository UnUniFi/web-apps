import { NodeToolModule } from '../../../views/tools/node-tool/node-tool.module';
import { NodeToolComponent } from './node-tool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [NodeToolComponent],
  imports: [CommonModule, NodeToolModule],
  exports: [NodeToolComponent],
})
export class AppNodeToolModule {}
