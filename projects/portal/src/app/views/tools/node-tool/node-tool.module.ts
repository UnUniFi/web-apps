import { MaterialModule } from '../../material.module';
import { NodeToolComponent } from './node-tool.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [NodeToolComponent],
  imports: [CommonModule, MaterialModule],
  exports: [NodeToolComponent],
})
export class NodeToolModule {}
