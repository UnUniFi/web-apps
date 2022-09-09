import { TxModule } from '../../views/txs/tx/tx.module';
import { TxsModule } from '../../views/txs/txs.module';
import { TxComponent } from './tx/tx.component';
import { TxsRoutingModule } from './txs-routing.module';
import { TxsComponent } from './txs.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TxComponent, TxsComponent],
  imports: [CommonModule, TxsRoutingModule, TxsModule, TxModule],
})
export class AppTxsModule {}
