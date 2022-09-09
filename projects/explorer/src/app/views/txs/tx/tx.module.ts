import { MaterialModule } from '../../material.module';
import { TxCommonModule } from './tx-common/tx-common.module';
import { TxComponent } from './tx.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TxComponent],
  imports: [CommonModule, MaterialModule, TxCommonModule],
  exports: [TxComponent],
})
export class TxModule {}
