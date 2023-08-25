import { PipesModule } from '../../../pipes/pipes.module';
import { TxComponent } from './tx.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TxComponent],
  imports: [CommonModule, PipesModule],
  exports: [TxComponent],
})
export class TxModule {}
