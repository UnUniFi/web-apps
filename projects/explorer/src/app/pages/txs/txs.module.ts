import { TxCommonModule } from '../../views/txs/tx/tx-common/tx-common.module';
import { TxModule } from '../../views/txs/tx/tx.module';
import { TxsModule } from '../../views/txs/txs.module';
import { TxMessagesComponent } from './tx/tx-messages/tx-messages.component';
import { TxComponent } from './tx/tx.component';
import { TxsRoutingModule } from './txs-routing.module';
import { TxsComponent } from './txs.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [TxComponent, TxsComponent, TxMessagesComponent],
  imports: [CommonModule, TxsRoutingModule, TxsModule, TxModule, TxCommonModule],
})
export class AppTxsModule {}
